/*
 * FooterCTA.tsx
 * ─────────────────────────────────────────────────────────────
 * フッターCTAセクション + フッター全体
 * 最後の背中を押す: 「5分で試せる」という具体的アクション
 */

import Link from "next/link";
import { Sparkles, Zap, Shield, Users, Clock, ArrowRight } from "lucide-react";
import SiteFooter from "@/components/lp/SiteFooter";

export default function FooterCTA() {
  return (
    <>
      {/* ── Final CTA Section ── */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-white/5 rounded-full" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-yellow-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            「自分には難しい」と
            <br className="hidden sm:block" />
            諦める必要はありません。
          </h2>

          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            今日から5分で始められます。
            事業内容を入力するだけで、AIがあなたの会社にぴったりの補助金を見つけます。
          </p>

          <p className="text-blue-200 text-sm mb-10">
            2,400社以上の中小企業が、補助金ナビAIで補助金を獲得しています。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-black/10 hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5" />
              無料で補助金を探す
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-xl border border-white/30 transition-all duration-200"
            >
              料金プランを見る
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-blue-200 text-sm">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              2,400社以上が利用中
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              登録30秒・操作3分
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              AES-256暗号化
            </span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
