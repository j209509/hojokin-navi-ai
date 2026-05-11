/**
 * app/api/admin/users/route.ts
 * 管理者専用：登録ユーザー一覧 + 各ユーザーの利用状況を返す
 */

import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";

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
    if (!isAdminEmail(session?.user?.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prisma = await getPrisma();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subsidyStatuses: true,
            bookmarks: true,
            matchingHistories: true,
          },
        },
        subsidyStatuses: {
          select: { status: true },
        },
        matchingHistories: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true, title: true },
        },
      },
    });

    // DB統計
    const [totalGrants, activeGrants, totalHistories] = await Promise.all([
      prisma.grant.count(),
      prisma.grant.count({ where: { isActive: true } }),
      prisma.matchingHistory.count(),
    ]);

    return NextResponse.json({
      users,
      stats: {
        totalUsers: users.length,
        totalGrants,
        activeGrants,
        totalHistories,
      },
    });
  } catch (e) {
    console.error("[GET /api/admin/users]", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
