"use client";
/*
 * NavigationBar.tsx — スティッキーナビ + アナウンスバー
 * スクロールで背景がsolid化、常時CTAボタンを表示
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Menu, X, Zap } from "lucide-react";

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* ── アナウンスバー ── */}
      {announcementVisible && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-2 px-4 text-center relative z-50">
          <p className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 flex-wrap">
            <Zap className="w-3.5 h-3.5 flex-shrink-0" />
            <span>🔥 今月締め切りが近い補助金が<strong>47件</strong>あります —</span>
            <Link href="/dashboard" className="underline font-bold hover:text-gray-700 transition-colors">
              今すぐ確認する →
            </Link>
          </p>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
            aria-label="閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── メインナビ ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="hidden sm:block">
              <p className={`font-extrabold text-sm leading-none transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
                補助金ナビAI
              </p>
              <p className={`text-xs leading-none mt-0.5 transition-colors ${scrolled ? "text-gray-400" : "text-blue-200"}`}>
                AI補助金マッチング
              </p>
            </div>
          </Link>

          {/* デスクトップリンク */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "使い方", href: "#howitworks" },
              { label: "対応補助金", href: "#coverage" },
              { label: "料金", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-gray-600 hover:text-gray-900" : "text-blue-100 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className={`hidden sm:block text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-blue-100 hover:text-white"
              }`}
            >
              ログイン
            </Link>
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5" />
              無料で始める
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="メニュー"
            >
              {mobileOpen
                ? <X className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
                : <Menu className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
              }
            </button>
          </div>
        </nav>

        {/* モバイルメニュー */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-xl">
            {[
              { label: "使い方", href: "#howitworks" },
              { label: "対応補助金", href: "#coverage" },
              { label: "料金プラン", href: "#pricing" },
              { label: "よくある質問", href: "#faq" },
              { label: "ログイン", href: "/auth/signin" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors border-b border-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/auth/signin"
              className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3.5 rounded-xl text-sm mt-3"
            >
              無料で補助金を探す →
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
