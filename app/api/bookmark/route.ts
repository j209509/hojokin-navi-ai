import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/bookmark — ブックマーク一覧取得
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: { grant: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch {
    return NextResponse.json(
      { error: "ブックマークの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST /api/bookmark — ブックマーク追加
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { grantId } = await request.json();

    if (!grantId) {
      return NextResponse.json(
        { error: "grantId は必須です" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        grantId,
      },
    });

    return NextResponse.json({
      message: "ブックマークに追加しました",
      bookmark,
    });
  } catch (error: unknown) {
    // 一意制約違反（すでにブックマーク済み）
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "すでにブックマーク済みです" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "ブックマークの追加に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmark — ブックマーク削除
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { grantId } = await request.json();

    await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        grantId,
      },
    });

    return NextResponse.json({ message: "ブックマークを削除しました" });
  } catch {
    return NextResponse.json(
      { error: "ブックマークの削除に失敗しました" },
      { status: 500 }
    );
  }
}
