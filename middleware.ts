import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 認証が必要なパス
const PROTECTED_PATHS = ["/dashboard"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isProtected = PROTECTED_PATHS.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // 未認証 + 保護ルートへのアクセス → サインインページへリダイレクト
  if (isProtected && !session) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // 静的ファイル・API（auth除く）はミドルウェアをスキップ
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
