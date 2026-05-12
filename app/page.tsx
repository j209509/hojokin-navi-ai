/*
 * app/page.tsx — 補助金ナビAI LP（大幅改修版）
 *
 * 構成（CVR最大化・離脱率最小化設計）:
 * 1. NavigationBar    — アナウンスバー + スティッキーCTA
 * 2. HeroSection      — フルスクリーン + AIデモUI + 金額インパクト
 * 3. StatsSection     — 圧倒的実績数字（ダーク）
 * 4. PainSection      — 課題共感 + 競合比較表（ダーク）
 * 5. HowItWorksSection — 3ステップ解説（ライト）
 * 6. TestimonialsSection — 具体的成果の声（グレー）
 * 7. CoverageSection  — 省庁・補助金カバレッジ
 * 8. PricingSection   — 料金（費用対効果訴求）
 * 9. FAQSection       — 離脱防止Q&A
 * 10. FooterCTA       — 最終プッシュCTA + フッター
 */

import NavigationBar from "@/components/lp/NavigationBar";
import HeroSection from "@/components/lp/HeroSection";
import StatsSection from "@/components/lp/StatsSection";
import PainSection from "@/components/lp/PainSection";
import HowItWorksSection from "@/components/lp/HowItWorksSection";
import TestimonialsSection from "@/components/lp/TestimonialsSection";
import CoverageSection from "@/components/lp/CoverageSection";
import PricingSection from "@/components/lp/PricingSection";
import FAQSection from "@/components/lp/FAQSection";
import FooterCTA from "@/components/lp/FooterCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <NavigationBar />

      <main>
        {/* 1. ファーストビュー：フルスクリーン + AIデモ + 金額インパクト */}
        <HeroSection />

        {/* 2. 実績数値：ダークテーマでインパクト */}
        <StatsSection />

        {/* 3. 課題共感 + 競合比較表 */}
        <PainSection />

        {/* 4. 使い方3ステップ（視覚的） */}
        <HowItWorksSection />

        {/* 5. お客様の声（具体的成果付き） */}
        <TestimonialsSection />

        {/* 6. 対応省庁・補助金カバレッジ */}
        <CoverageSection />

        {/* 7. 料金プラン（費用対効果訴求） */}
        <PricingSection />

        {/* 8. FAQ（離脱防止・不安解消） */}
        <FAQSection />
      </main>

      {/* 9. ラストプッシュCTA + フッター */}
      <FooterCTA />
    </div>
  );
}
