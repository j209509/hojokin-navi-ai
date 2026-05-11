/*
 * NavigationBar.tsx
 * ─────────────────────────────────────────────────────────────
 * スティッキーナビゲーションバー
 * - スクロール20px以上で白背景+shadow に切り替え
 * - デスクトップ: 水平メニュー + CTA ボタン
 * - モバイル: ハンバーガーメニュー
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";

const navLinks = [
  { label: "課題", href: "#pain" },
  { label: "仕組み", href: "#how-it-works" },
  { label: "対応範囲", href: "#coverage" },
  { label: "料金", href: "#pricing" },
  { label: "よくある質問", href: "#faq" },
];

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <span
            className={`font-bold text-base transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            補助金ナビAI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                scrolled ? "text-gray-600" : "text-blue-200"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              scrolled ? "text-gray-700" : "text-blue-200"
            }`}
          >
            ログイン
          </Link>
          <Link
            href="/auth/signin"
            className="text-sm font-semibold bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-4 py-2 rounded-lg transition-all shadow-sm hover:-translate-y-0.5"
          >
            無料で始める
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            scrolled ? "hover:bg-gray-100 text-gray-900" : "hover:bg-white/10 text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="block py-2.5 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="px-4 pb-4 pt-2 flex flex-col gap-2 border-t border-gray-100">
            <Link
              href="/dashboard"
              className="block text-center py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signin"
              className="block text-center py-2.5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-semibold rounded-lg text-sm"
            >
              無料で始める（登録30秒）
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
