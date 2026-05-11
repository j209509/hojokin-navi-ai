/*
 * HowItWorksSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 5ステップのタイムライン形式（縦線で繋がったステップ）
 * デスクトップ: 奇数=左テキスト右アイコン、偶数=左アイコン右テキスト の交互レイアウト
 * モバイル: 縦積み（左に縦線、右にコンテンツ）
 * Sansan スタイル: 業務変革ストーリーとして5ステップを語る
 */

import { FileText, Cpu, ListChecks, PenLine, Bell } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FileText,
    title: "事業情報を入力（3分）",
    desc: "業種・事業内容・資本金・従業員数を入力するだけ。難しい専門用語は一切不要。日本語で普通に書いていただければOKです。",
    badge: "3分で完了",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AIが全国補助金をスキャン（30秒）",
    desc: "経産省・厚労省・都道府県・市区町村の2,400件のデータベースをリアルタイム検索。あなたの事業特性・規模・地域に合った補助金のみを抽出します。",
    badge: "30秒で完了",
    color: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    step: "03",
    icon: ListChecks,
    title: "最適な補助金リストを確認",
    desc: "採択確率・補助額・締切日付きで優先順位表示。「なぜあなたの事業に合うか」の理由もAIが説明するので、自信を持って申請を選べます。",
    badge: "採択率付きで表示",
    color: "from-violet-500 to-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    step: "04",
    icon: PenLine,
    title: "申請書テンプレートで下書き作成",
    desc: "AIが事業情報をもとに申請書の文章を自動生成。採択実績の高いテンプレートに沿って下書きを作るから、修正するだけで完成します。",
    badge: "自動生成",
    color: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    step: "05",
    icon: Bell,
    title: "締切管理・採択結果を追跡",
    desc: "締切アラートで申請機会を逃しません。採択結果を記録・分析して次回の申請戦略に活かす。補助金獲得の「勝ちパターン」を蓄積します。",
    badge: "締切アラート自動設定",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
            5ステップで補助金採択へ
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            「難しそう」という不安を、一つずつ解消していきます。
            最初の入力から申請書完成まで、最短半日で完了します。
          </p>
        </div>

        {/* Desktop timeline (hidden on mobile) */}
        <div className="hidden md:block">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isRight = i % 2 === 0; // 奇数ステップ(0,2,4) = テキスト左・アイコン右
            return (
              <div key={step.step} className="relative">
                {/* Vertical connector (not after last step) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[90px] w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-200 z-0" />
                )}

                <div
                  className={`relative z-10 flex items-center gap-8 mb-8 ${
                    isRight ? "" : "flex-row-reverse"
                  }`}
                >
                  {/* Text side */}
                  <div className={`flex-1 ${isRight ? "text-right pr-4" : "text-left pl-4"}`}>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Center icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="mt-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-black text-gray-600">{step.step}</span>
                    </div>
                  </div>

                  {/* Spacer side */}
                  <div className="flex-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex gap-4">
                {/* Left: icon column */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex-shrink-0 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {/* Vertical line */}
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 my-2 bg-gradient-to-b from-gray-300 to-gray-200 min-h-[2rem]" />
                  )}
                </div>

                {/* Right: content */}
                <div className={`flex-1 pb-8 ${i === STEPS.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-gray-400">{step.step}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 text-base">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
