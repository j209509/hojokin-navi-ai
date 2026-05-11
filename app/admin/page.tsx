/**
 * app/admin/page.tsx — 管理者専用ページ
 * ログイン + ADMIN_EMAIL 一致でのみアクセス可
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import AdminPanel from "@/components/AdminPanel";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  // 未認証 → サインインへ
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // 管理者以外 → ダッシュボードへ
  if (!isAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理者ヘッダーバー */}
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-indigo-900" />
          </div>
          <span className="font-bold text-sm">補助金ナビAI — 管理者パネル</span>
          <span className="ml-2 text-xs bg-indigo-600 text-indigo-200 px-2 py-0.5 rounded-full">
            {session.user.email}
          </span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-indigo-200 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          ダッシュボードへ戻る
        </Link>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto">
        <AdminPanel />
      </main>
    </div>
  );
}
