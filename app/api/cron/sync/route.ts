/**
 * app/api/cron/sync/route.ts
 * Vercel Cronジョブによる自動定期同期
 *
 * スケジュール: 毎週月曜 03:00 UTC（= 月曜12:00 JST）
 * 設定: vercel.json の crons セクション
 *
 * Vercel は Cron 実行時に Authorization: Bearer ${CRON_SECRET} を付与。
 * 環境変数 CRON_SECRET を Vercel ダッシュボードで設定すること。
 *
 * ─── ローカルテスト ───────────────────────────────────────────────
 * curl -X GET http://localhost:3000/api/cron/sync \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */

import { NextResponse } from "next/server";
import {
  fetchAllActiveSubsidies,
  convertJGrantsToGrant,
} from "@/lib/jgrants";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  // Vercel Cron は Authorization ヘッダーに CRON_SECRET を付与する
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();
  console.log(`[cron/sync] 開始: ${startedAt}`);

  try {
    // jGrants から全受付中補助金を取得
    const subsidies = await fetchAllActiveSubsidies();
    console.log(`[cron/sync] 取得件数: ${subsidies.length}`);

    // DB接続
    const { default: prisma } = await import("@/lib/prisma");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (prisma as any).grant as {
      upsert: (args: unknown) => Promise<unknown>;
    };

    let upserted = 0;
    let failed = 0;

    for (const subsidy of subsidies) {
      try {
        const data = convertJGrantsToGrant(subsidy);
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
            isActive: true,
            url: data.url,
            updatedAt: new Date(),
          },
          create: data,
        });
        upserted++;
      } catch {
        failed++;
      }
    }

    const result = {
      success: true,
      upserted,
      failed,
      total: subsidies.length,
      startedAt,
      completedAt: new Date().toISOString(),
    };

    console.log(`[cron/sync] 完了:`, result);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[cron/sync] エラー:`, message);
    return NextResponse.json(
      { success: false, error: message, startedAt },
      { status: 500 }
    );
  }
}
