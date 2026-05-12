/*
 * FooterCTA.tsx — ラストプッシュCTA（最終離脱防止）
 */

import Link from "next/link";
import { Zap, Shield, Users, ArrowRight, CheckCircle, Star } from "lucide-react";
import SiteFooter from "@/components/lp/SiteFooter";

export default function FooterCTA() {
  return (
    <>
      {/* ── Final CTA Section ── */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* 星評価 */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-yellow-300 font-bold ml-2">4.8</span>
            <span className="text-blue-300 text-sm ml-1">（312件のレビュー）</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            今日から、<span className="text-yellow-300">補助金を</span><br />
            <span className="text-yellow-300">諦めない</span>会社になる。
          </h2>

          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            登録は30秒。クレジットカード不要。
            今すぐAIに事業内容を入力して、あなたの会社が受け取れる補助金を見つけましょう。
          </p>

          {/* チェックリスト */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 text-blue-200 text-sm">
            {[
              "無料プランあり",
              "クレジットカード不要",
              "AIが2,891件から即マッチング",
              "申請書テンプレート自動生成",
              "いつでも解約OK",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/signin"
              className="group inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-xl px-10 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:-translate-y-1"
            >
              <Zap className="w-6 h-6" />
              無料で補助金を探す
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 信頼シグナル */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-blue-300 text-sm">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              2,400社以上が導入中
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              SSL暗号化・安全なデータ保護
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              累計補助金獲得サポート額 ¥48億円+
            </span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
