"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Shield, Zap, Users } from "lucide-react";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const error = searchParams.get("error");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="font-bold text-xl text-gray-900">補助金ナビAI</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-2">
              ログイン
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Googleアカウントで簡単にサインイン
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error === "OAuthAccountNotLinked"
                ? "別のプロバイダーで登録済みのメールアドレスです。"
                : "サインインに失敗しました。もう一度お試しください。"}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            {/* Google logo SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Googleでログイン</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">または</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Info */}
          <div className="space-y-2.5">
            {[
              { icon: Shield, text: "銀行レベルの暗号化でデータを保護" },
              { icon: Zap, text: "無料プランで今すぐ始められます" },
              { icon: Users, text: "2,400社以上が利用中" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-gray-500">
                <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-6">
            ログインすることで
            <Link href="/" className="text-blue-600 hover:underline mx-1">利用規約</Link>
            および
            <Link href="/" className="text-blue-600 hover:underline mx-1">プライバシーポリシー</Link>
            に同意したものとみなされます。
          </p>
        </div>

        {/* Back to top */}
        <p className="text-center mt-4 text-blue-300 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            ← トップページに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-950 flex items-center justify-center text-white">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
