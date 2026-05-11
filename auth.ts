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

  // コールバック
  callbacks: {
    // セッションにユーザーIDを追加
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // デバッグ（開発環境のみ）
  debug: process.env.NODE_ENV === "development",
});
