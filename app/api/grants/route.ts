/**
 * app/api/grants/route.ts
 * 補助金一覧・検索 API
 *
 * GET /api/grants
 * ?search=キーワード  テキスト検索
 * ?category=カテゴリ  カテゴリフィルタ
 * ?ministry=省庁     省庁フィルタ
 * ?limit=50          取得件数（デフォルト50）
 * ?offset=0          オフセット（デフォルト0）
 *
 * 取得優先順位:
 *   1. DB に補助金データがあればDBから返す
 *   2. DB が空なら jGrants API をリアルタイム検索
 *   3. jGrants も失敗したらモックデータを返す
 */

import { NextResponse } from "next/server";
import { MOCK_GRANTS } from "@/lib/mockData";
import { fetchJGrantsSubsidies, convertJGrantsToGrant } from "@/lib/jgrants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search     = searchParams.get("search")     ?? "";
  const category   = searchParams.get("category")   ?? "";
  const ministry   = searchParams.get("ministry")   ?? "";
  const activeOnly = searchParams.get("activeOnly") === "true";
  const limit    = Math.min(parseInt(searchParams.get("limit")  ?? "50", 10), 200);
  const offset   = parseInt(searchParams.get("offset") ?? "0", 10);

  // ─── 1. DB から取得 ───────────────────────────────────────────────
  try {
    const { default: prisma } = await import("@/lib/prisma");

    const where: Record<string, unknown> = {};
    if (activeOnly) where.isActive = true;
    if (category) where.category = category;
    if (ministry) where.ministry = ministry;
    if (search) {
      where.OR = [
        { name:        { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags:        { has: search } },
      ];
    }

    const [grants, total] = await Promise.all([
      prisma.grant.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.grant.count({ where }),
    ]);

    // DB に本番データがある場合
    if (total > 0) {
      return NextResponse.json({ grants, total, source: "database" });
    }
  } catch {
    // DB 未接続 → フォールバックへ
  }

  // ─── 2. jGrants API をリアルタイム検索 ───────────────────────────
  try {
    const keyword = search || category || ministry || "補助金";
    const result = await fetchJGrantsSubsidies({
      keyword: keyword.length >= 2 ? keyword : "補助金",
      sort: "acceptance_end_datetime",
      order: "ASC",
      acceptance: 1,
    });

    const grants = result.result
      .slice(offset, offset + limit)
      .map((s) => ({
        ...convertJGrantsToGrant(s),
        id: s.id,
      }));

    return NextResponse.json({
      grants,
      total: result.metadata.resultset.count,
      source: "jgrants",
    });
  } catch {
    // jGrants も失敗 → モックデータ
  }

  // ─── 3. モックデータ ─────────────────────────────────────────────
  const mocks = MOCK_GRANTS as unknown as Array<{
    id: string; name: string; ministry: string; category: string;
    description: string; maxAmount: number; adoptionRate?: number | null;
    deadline?: string | null; tags: readonly string[];
  }>;

  let filtered = mocks.filter((g) => {
    const matchSearch   = !search   || g.name.includes(search) || (g.description ?? "").includes(search);
    const matchCategory = !category || g.category === category;
    const matchMinistry = !ministry || g.ministry === ministry;
    return matchSearch && matchCategory && matchMinistry;
  });

  const total = filtered.length;
  filtered = filtered.slice(offset, offset + limit);

  return NextResponse.json({ grants: filtered, total, source: "mock" });
}
