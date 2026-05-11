import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// ─── 認証設定 ─────────────────────────────────────────────────────────
// 現在はJWT戦略（DB不要）で運用。
// Supabase DATABASE_URLを設定後に PrismaAdapter を有効化してください。
//
// 有効化方法:
//   import { PrismaAdapter } from "@auth/prisma-adapter";
//   import prisma from "@/lib/prisma";
//   → adapter: PrismaAdapter(prisma), session: { strategy: "database" }

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // カスタムページ
  pages: {
    signIn: "/auth/signin",
  },

  // JWTセッション（DATABASE_URL不要）
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  // コールバック
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回ログイン時にトークンへ情報を格納
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      // セッションオブジェクトにユーザー情報を追加
      if (session.user) {
        session.user.id = (token.id ?? token.sub ?? "") as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = (token.picture ?? null) as string | null;
      }
      return session;
    },
  },

  // シークレット
  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
});
