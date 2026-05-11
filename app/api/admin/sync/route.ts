/**
 * app/api/admin/sync/route.ts
 * 複数ソースから補助金データをDBに同期する管理者API
 *
 * POST /api/admin/sync
 * ?mode=active   受付中のみ（高速・約250件）※デフォルト
 * ?mode=full     jGrants全件 + 厚労省（低速・約2,000件超）
 * ?mode=mhlw     厚労省のみ（高速・約30件）
 * ?mode=test     モックデータで動作確認のみ
 *
 * GET /api/admin/sync   最終同期ステータス取得
 */

import { NextResponse } from "next/server";
import {
  fetchAllActiveSubsidies,
  convertJGrantsToGrant,
  fetchJGrantsDetail,
  enrichGrantWithDetail,
} from "@/lib/jgrants";
import { fetchMhlwGrants, convertMhlwToGrant } from "@/lib/mhlw";
import { MOCK_GRANTS } from "@/lib/mockData";
import { isAdminEmail } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAdminBySecret(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;
  return authHeader === `Bearer ${adminSecret}`;
}

async function isAdminBySession(): Promise<boolean> {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    return isAdminEmail(session?.user?.email);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isAdminBySecret(request) && !(await isAdminBySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode        = searchParams.get("mode") ?? "active";
  const enrichDetail = searchParams.get("enrichDetail") === "true";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        send({ type: "start", message: `同期開始（モード: ${mode}）` });

        // ─── テストモード ───────────────────────────────────────────
        if (mode === "test") {
          send({ type: "info", message: "テストモード: モックデータで動作確認" });
          let count = 0;
          for (const _ of MOCK_GRANTS) {
            count++;
            if (count % 10 === 0) send({ type: "progress", current: count, total: MOCK_GRANTS.length });
          }
          send({ type: "complete", upserted: count, failed: 0, total: MOCK_GRANTS.length,
            message: `テスト完了: ${count}件処理（DBへの書き込みはスキップ）` });
          controller.close();
          return;
        }

        // ─── DB接続 ────────────────────────────────────────────────
        let db: { upsert: (args: unknown) => Promise<unknown>; count: () => Promise<number> };
        try {
          const { default: prisma } = await import("@/lib/prisma");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          db = (prisma as any).grant;
        } catch (e) {
          send({ type: "error", message: `DB接続に失敗: ${e instanceof Error ? e.message : "Unknown error"}` });
          controller.close();
          return;
        }

        let totalUpserted = 0;
        let totalFailed = 0;

        // ─── jGrants 取得 ─────────────────────────────────────────
        if (mode !== "mhlw") {
          const includeAll = mode === "full";
          send({
            type: "info",
            message: includeAll
              ? "jGrants APIから全件取得中（締切済み含む・複数キーワード）..."
              : "jGrants APIから受付中の補助金を取得中...",
          });

          let jgrantsSubsidies;
          try {
            jgrantsSubsidies = await fetchAllActiveSubsidies(includeAll);
          } catch (e) {
            send({ type: "error", message: `jGrants API接続失敗: ${e instanceof Error ? e.message : String(e)}` });
            controller.close();
            return;
          }

          send({
            type: "info",
            message: `jGrants取得完了: ${jgrantsSubsidies.length}件（重複除去済み）`,
            totalCount: jgrantsSubsidies.length,
          });

          let upserted = 0;
          let failed = 0;

          for (const subsidy of jgrantsSubsidies) {
            try {
              let data = convertJGrantsToGrant(subsidy);

              if (enrichDetail) {
                const detail = await fetchJGrantsDetail(subsidy.id);
                if (detail) data = enrichGrantWithDetail(data, detail);
                await new Promise((r) => setTimeout(r, 150));
              }

              await db.upsert({
                where: { jgrantsId: subsidy.id },
                update: {
                  name: data.name,
                  ministry: data.ministry,
                  category: data.category,
                  description: data.description,
                  maxAmount: data.maxAmount,
                  deadline: data.deadline,
                  tags: data.tags,
                  isActive: data.isActive,
                  url: data.url,
                  updatedAt: new Date(),
                },
                create: data,
              });
              upserted++;
              if (upserted % 50 === 0) {
                send({ type: "progress", current: totalUpserted + upserted, total: jgrantsSubsidies.length,
                  message: `jGrants保存中: ${upserted}/${jgrantsSubsidies.length}件` });
              }
            } catch { failed++; }
          }

          totalUpserted += upserted;
          totalFailed += failed;
          send({ type: "info", message: `jGrants完了: ${upserted}件保存（失敗: ${failed}件）` });
        }

        // ─── 厚労省 助成金 ─────────────────────────────────────────
        if (mode === "full" || mode === "mhlw") {
          send({ type: "info", message: "厚労省 雇用関係助成金を取得中..." });

          try {
            const mhlwGrants = await fetchMhlwGrants();
            send({ type: "info", message: `厚労省: ${mhlwGrants.length}件取得` });

            let upserted = 0;
            let failed = 0;

            for (const grant of mhlwGrants) {
              try {
                const data = convertMhlwToGrant(grant);
                // 厚労省はjgrantsIdがないのでnameでupsert
                await db.upsert({
                  where: { jgrantsId: `mhlw-${grant.name.slice(0, 30)}` },
                  update: {
                    name: data.name,
                    ministry: data.ministry,
                    category: data.category,
                    description: data.description,
                    maxAmount: data.maxAmount,
                    deadline: data.deadline,
                    tags: data.tags,
                    isActive: true,
                    url: data.url,
                    updatedAt: new Date(),
                  },
                  create: {
                    ...data,
                    jgrantsId: `mhlw-${grant.name.slice(0, 30)}`,
                  },
                });
                upserted++;
              } catch { failed++; }
            }

            totalUpserted += upserted;
            totalFailed += failed;
            send({ type: "info", message: `厚労省完了: ${upserted}件保存（失敗: ${failed}件）` });
          } catch (e) {
            send({ type: "warning", message: `厚労省取得失敗（スキップ）: ${e instanceof Error ? e.message : String(e)}` });
          }
        }

        const finalCount = await db.count();
        send({
          type: "complete",
          upserted: totalUpserted,
          failed: totalFailed,
          total: totalUpserted + totalFailed,
          message: `同期完了！合計${totalUpserted}件保存。DB総件数: ${finalCount}件`,
          syncedAt: new Date().toISOString(),
        });
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "Unknown error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET(request: Request) {
  if (!isAdminBySecret(request) && !(await isAdminBySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { default: prisma } = await import("@/lib/prisma");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (prisma as any).grant as {
      count: (args?: unknown) => Promise<number>;
      findFirst: (args: unknown) => Promise<{ updatedAt: Date } | null>;
    };

    const [totalGrants, activeGrants, latestGrant] = await Promise.all([
      db.count(),
      db.count({ where: { isActive: true } }),
      db.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    ]);

    return NextResponse.json({
      totalGrants,
      activeGrants,
      lastSyncedAt: latestGrant?.updatedAt ?? null,
      mockGrantsCount: MOCK_GRANTS.length,
      status: "ready",
      modes: {
        active: "受付中のみ（高速・約250件）",
        full:   "jGrants全件 + 厚労省（低速・約2,000件超）",
        mhlw:   "厚労省のみ（高速・約30件）",
        test:   "テスト（DB書き込みなし）",
      },
    });
  } catch {
    return NextResponse.json({
      totalGrants: 0,
      activeGrants: 0,
      lastSyncedAt: null,
      mockGrantsCount: MOCK_GRANTS.length,
      status: "db_not_connected",
    });
  }
}
