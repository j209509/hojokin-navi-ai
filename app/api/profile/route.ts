import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/profile — 現在のユーザープロフィール取得
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST /api/profile — プロフィール保存・更新
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyName, industry, employeeCount, annualRevenue, prefecture, budget } = body;

    // upsert（存在すれば更新、なければ作成）
    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        companyName,
        industry,
        employeeCount,
        annualRevenue,
        prefecture,
        budget,
      },
      create: {
        userId: session.user.id,
        companyName,
        industry,
        employeeCount,
        annualRevenue,
        prefecture,
        budget,
      },
    });

    return NextResponse.json({
      message: "プロフィールを保存しました",
      profile,
    });
  } catch {
    return NextResponse.json(
      { error: "プロフィールの保存に失敗しました" },
      { status: 500 }
    );
  }
}
