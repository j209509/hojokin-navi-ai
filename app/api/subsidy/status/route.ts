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

// GET /api/subsidy/status — 自分の申請状況一覧を取得
export async function GET() {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const prisma = await getPrisma();
    const statuses = await prisma.subsidyApplicationStatus.findMany({
      where: { userId: session.user.id },
      include: { grant: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ statuses });
  } catch {
    return NextResponse.json({ error: "申請状況の取得に失敗しました" }, { status: 500 });
  }
}

// POST /api/subsidy/status — 申請状況を新規作成
export async function POST(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json() as {
      subsidyId: string;
      status: string;
      notes?: string;
    };
    if (!body.subsidyId || !body.status) {
      return NextResponse.json({ error: "subsidyId と status は必須です" }, { status: 400 });
    }
    const prisma = await getPrisma();
    const record = await prisma.subsidyApplicationStatus.create({
      data: {
        userId: session.user.id,
        subsidyId: body.subsidyId,
        status: body.status,
        notes: body.notes,
      },
    });
    return NextResponse.json({ message: "申請状況を登録しました", record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "申請状況の登録に失敗しました" }, { status: 500 });
  }
}

// PATCH /api/subsidy/status — 申請状況を更新
export async function PATCH(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json() as {
      id: string;
      status?: string;
      notes?: string;
    };
    if (!body.id) {
      return NextResponse.json({ error: "id は必須です" }, { status: 400 });
    }
    const prisma = await getPrisma();
    // 自分のレコードのみ更新可
    const existing = await prisma.subsidyApplicationStatus.findFirst({
      where: { id: body.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "レコードが見つかりません" }, { status: 404 });
    }
    const record = await prisma.subsidyApplicationStatus.update({
      where: { id: body.id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
    });
    return NextResponse.json({ message: "申請状況を更新しました", record });
  } catch {
    return NextResponse.json({ error: "申請状況の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE /api/subsidy/status — 申請状況を削除
export async function DELETE(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await request.json() as { id: string };
    if (!id) {
      return NextResponse.json({ error: "id は必須です" }, { status: 400 });
    }
    const prisma = await getPrisma();
    await prisma.subsidyApplicationStatus.deleteMany({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({ message: "申請状況を削除しました" });
  } catch {
    return NextResponse.json({ error: "申請状況の削除に失敗しました" }, { status: 500 });
  }
}
