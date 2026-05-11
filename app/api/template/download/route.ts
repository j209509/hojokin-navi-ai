import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getAuth() {
  const { auth } = await import("@/auth");
  return auth();
}

// GET /api/template/download?path=<storagePath>
export async function GET(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    if (!filePath) {
      return NextResponse.json({ error: "path パラメータが必要です" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase が設定されていません" }, { status: 503 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.storage
      .from("templates")
      .download(filePath);

    if (error || !data) {
      console.error("Supabase download error:", error);
      return NextResponse.json({ error: "ファイルのダウンロードに失敗しました" }, { status: 500 });
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = filePath.split("/").pop() ?? "download";
    const contentType = data.type || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "ダウンロード処理中にエラーが発生しました" }, { status: 500 });
  }
}
