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
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: { grant: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookmarks });
  } catch {
    return NextResponse.json({ error: "ブックマークの取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { grantId } = await request.json() as { grantId: string };
    if (!grantId) {
      return NextResponse.json({ error: "grantId は必須です" }, { status: 400 });
    }
    const prisma = await getPrisma();
    const bookmark = await prisma.bookmark.create({
      data: { userId: session.user.id, grantId },
    });
    return NextResponse.json({ message: "ブックマークに追加しました", bookmark });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "すでにブックマーク済みです" }, { status: 409 });
    }
    return NextResponse.json({ error: "ブックマークの追加に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { grantId } = await request.json() as { grantId: string };
    const prisma = await getPrisma();
    await prisma.bookmark.deleteMany({ where: { userId: session.user.id, grantId } });
    return NextResponse.json({ message: "ブックマークを削除しました" });
  } catch {
    return NextResponse.json({ error: "ブックマークの削除に失敗しました" }, { status: 500 });
  }
}
