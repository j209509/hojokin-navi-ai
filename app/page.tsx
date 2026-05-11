/*
 * app/page.tsx — 補助金ナビAI ランディングページ (Phase 6)
 * ─────────────────────────────────────────────────────────────
 * 【LP設計パターン（日本SaaS LPリサーチに基づく）】
 *
 * 採用パターン:
 * 1. freee スタイル — 「5分で完了」「登録30秒」の定量訴求で心理的ハードルを最低化
 * 2. SmartHR スタイル — Pain→Agitate→Solution の課題共感構造で意思決定を加速
 * 3. マネーフォワード スタイル — 「¥4.8億累計獲得」等の実績数値を Hero 近くに配置
 *
 * 【本質的価値の訴求軸】
 * 解決する問題: 中小企業・個人事業主が補助金を自力で探すのに膨大な時間を費やし、
 *               申請機会を逃し続けている
 * ターゲットの痛み: 行政窓口（待ち時間）・社労士（高コスト）・自力検索（分散・難解）
 * なぜ最終解答なのか: AIが事業内容を理解→2,400件から瞬時にマッチング→申請書下書き自動生成
 * ユーザー体験: 「自分には難しい」と諦めていた事業者が5分で補助金と申請書を手に入れる
 *
 * サーバーコンポーネント — 全 lp/ サブコンポーネントをインポートして組み立てる
 */

import NavigationBar from "@/components/lp/NavigationBar";
import HeroSection from "@/components/lp/HeroSection";
import StatsSection from "@/components/lp/StatsSection";
import PainSection from "@/components/lp/PainSection";
import HowItWorksSection from "@/components/lp/HowItWorksSection";
import CoverageSection from "@/components/lp/CoverageSection";
import DogfoodingSection from "@/components/lp/DogfoodingSection";
import PricingSection from "@/components/lp/PricingSection";
import TestimonialsSection from "@/components/lp/TestimonialsSection";
import FAQSection from "@/components/lp/FAQSection";
import FooterCTA from "@/components/lp/FooterCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <NavigationBar />

      <main>
        {/* 1. ファーストビュー — AIアニメーション付き */}
        <HeroSection />

        {/* 2. 実績数値 — カウントアップで信頼感を付与 */}
        <StatsSection />

        {/* 3. 課題共感 → 解決策 → ROI計算ツール */}
        <PainSection />

        {/* 4. 仕組み解説 — 5ステップタイムライン */}
        <HowItWorksSection />

        {/* 5. 対応補助金・省庁カバレッジ */}
        <CoverageSection />

        {/* 6. 自己実証 — 自社でも使っている証明 */}
        <DogfoodingSection />

        {/* 7. 料金プラン */}
        <PricingSection />

        {/* 8. お客様の声 */}
        <TestimonialsSection />

        {/* 9. よくある質問 */}
        <FAQSection />
      </main>

      {/* 10. フッターCTA + フッター */}
      <FooterCTA />
    </div>
  );
}
