import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Prismaアダプター（DBセッション管理）
  adapter: PrismaAdapter(prisma),

  // プロバイダー設定
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

  // セッション戦略：JWTを使用（DB未接続時もフォールバック可能）
  session: {
    strategy: "jwt",
  },

  // コールバック
  callbacks: {
    // JWTにユーザーIDを保存
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // セッションにユーザーIDを追加
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // デバッグ（開発環境のみ）
  debug: process.env.NODE_ENV === "development",
});
