import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getAuth() {
  const { auth } = await import("@/auth");
  return auth();
}

// POST /api/template/upload — Supabase Storage へファイルをアップロード
export async function POST(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const category = formData.get("category") as string | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase が設定されていません" }, { status: 503 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const ext = file.name.split(".").pop() ?? "bin";
    const timestamp = Date.now();
    const filePath = `${session.user.id}/${timestamp}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }

    // DB に Template レコードも登録
    try {
      const { default: prisma } = await import("@/lib/prisma");
      await prisma.template.create({
        data: {
          title: title ?? file.name,
          content: filePath, // Storage のパスを保存
          category: category ?? "その他",
          format: ext.toUpperCase(),
        },
      });
    } catch {
      // DB 未接続時は Storage のみで OK
    }

    return NextResponse.json({
      message: "アップロード完了",
      path: filePath,
    });
  } catch {
    return NextResponse.json({ error: "アップロード処理中にエラーが発生しました" }, { status: 500 });
  }
}
