import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getAuth() {
  const { auth } = await import("@/auth");
  return auth();
}
async function getPrisma() {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma;
}

// GET /api/match/history — ユーザーのマッチング履歴一覧
export async function GET() {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const prisma = await getPrisma();
    const histories = await prisma.matchingHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        industry: true,
        employeeCount: true,
        region: true,
        resultsJson: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ histories });
  } catch (e) {
    console.error("[GET /api/match/history]", e);
    return NextResponse.json({ histories: [] });
  }
}

// POST /api/match/history — マッチング結果を履歴として保存
export async function POST(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as {
      businessDesc: string;
      industry: string;
      employeeCount?: string;
      region?: string;
      results: unknown[];
    };

    const { businessDesc, industry, employeeCount, region, results } = body;

    // タイトル自動生成：業種 × 事業内容の先頭25文字
    const descPreview = businessDesc.replace(/\s+/g, "").slice(0, 25);
    const title = `${industry} × ${descPreview}${businessDesc.length > 25 ? "…" : ""}`;

    const prisma = await getPrisma();
    const history = await prisma.matchingHistory.create({
      data: {
        userId: session.user.id,
        title,
        businessDesc,
        industry,
        employeeCount: employeeCount ?? null,
        region: region ?? null,
        resultsJson: results as object[],
      },
    });

    return NextResponse.json({ id: history.id, title: history.title });
  } catch (e) {
    console.error("[POST /api/match/history]", e);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}
