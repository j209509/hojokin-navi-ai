/**
 * app/api/dashboard/stats/route.ts
 * ダッシュボード用の統計情報を返す
 */

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

export async function GET() {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getPrisma();

    // ユーザーの申請ステータス一覧（グラント情報含む）
    const statuses = await prisma.subsidyApplicationStatus.findMany({
      where: { userId: session.user.id },
      include: {
        grant: {
          select: { id: true, name: true, maxAmount: true, deadline: true, url: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // ステータス別件数
    const counts = { 準備中: 0, 申請済: 0, 結果待ち: 0, 採択: 0, 不採択: 0 };
    let totalAdoptedAmount = 0;
    for (const s of statuses) {
      if (s.status in counts) {
        counts[s.status as keyof typeof counts]++;
      }
      if (s.status === "採択") {
        totalAdoptedAmount += s.grant.maxAmount;
      }
    }

    // DB内の受付中グラントから90日以内に締切があるものを抽出
    const today = new Date();
    const ninetyDaysLater = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

    const activeGrants = await prisma.grant.findMany({
      where: { isActive: true },
      select: { id: true, name: true, deadline: true, maxAmount: true, url: true },
      orderBy: { updatedAt: "desc" },
      take: 500,
    });

    const upcomingDeadlines = activeGrants
      .filter((g) => {
        if (!g.deadline || g.deadline === "通年" || g.deadline === "要確認") return false;
        const parts = g.deadline.split("/").map(Number);
        if (parts.length < 3 || parts.some(isNaN)) return false;
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d >= today && d <= ninetyDaysLater;
      })
      .map((g) => {
        const parts = g.deadline!.split("/").map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const daysLeft = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return { ...g, daysLeft };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 6);

    // 最近のアクティビティ（申請ステータス更新履歴）
    const recentActivities = statuses.slice(0, 6).map((s) => ({
      id: s.id,
      grantName: s.grant.name,
      status: s.status,
      updatedAt: s.updatedAt.toISOString(),
    }));

    // DB登録補助金総数（受付中）
    const totalGrants = await prisma.grant.count({ where: { isActive: true } });

    return NextResponse.json({
      totalGrants,
      applications: { ...counts, total: statuses.length },
      totalAdoptedAmount,
      upcomingDeadlines,
      recentActivities,
    });
  } catch {
    // DB未接続時は空データを返す
    return NextResponse.json({
      totalGrants: 0,
      applications: { 準備中: 0, 申請済: 0, 結果待ち: 0, 採択: 0, 不採択: 0, total: 0 },
      totalAdoptedAmount: 0,
      upcomingDeadlines: [],
      recentActivities: [],
    });
  }
}
