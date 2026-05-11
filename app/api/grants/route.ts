import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_GRANTS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

// GET /api/grants — 補助金一覧取得（DB優先、フォールバックはモックデータ）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const ministry = searchParams.get("ministry");
    const search = searchParams.get("search");

    const grants = await prisma.grant.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(ministry ? { ministry } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // DBにデータがあればそれを返す
    if (grants.length > 0) {
      return NextResponse.json({ grants, source: "database" });
    }

    // DB未接続 or データなし → モックデータを返す
    return NextResponse.json({ grants: MOCK_GRANTS, source: "mock" });
  } catch {
    // エラー時はモックデータにフォールバック
    return NextResponse.json({ grants: MOCK_GRANTS, source: "mock" });
  }
}
