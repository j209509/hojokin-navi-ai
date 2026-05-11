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
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "プロフィールの取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json() as {
      companyName?: string; industry?: string; employeeCount?: string;
      annualRevenue?: string; prefecture?: string; budget?: string;
    };
    const prisma = await getPrisma();
    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: body,
      create: { userId: session.user.id, ...body },
    });
    return NextResponse.json({ message: "プロフィールを保存しました", profile });
  } catch {
    return NextResponse.json({ error: "プロフィールの保存に失敗しました" }, { status: 500 });
  }
}
