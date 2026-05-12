/*
 * HowItWorksSection.tsx — 使い方3ステップ（ビジュアル重視）
 */

import Link from "next/link";
import { FileText, Sparkles, CheckCircle, ArrowRight, Clock } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: FileText,
    title: "事業内容を入力する",
    desc: "事業内容・業種・従業員数・課題を入力するだけ。行政の難しい知識は一切不要。",
    detail: "入力例：「EC運営・在庫管理の自動化を検討中の小売業・従業員12名」",
    color: "from-blue-500 to-blue-700",
    bgAccent: "bg-blue-50",
    textAccent: "text-blue-700",
    time: "約2分",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AIが最適な補助金を提示",
    desc: "全国2,891件の補助金データベースをAIがリアルタイムで分析。マッチ度・受給額・採択率でランキング表示。",
    detail: "Claude AI（Anthropic）の最新モデルが業種・規模・課題を総合的に判断",
    color: "from-purple-500 to-indigo-600",
    bgAccent: "bg-purple-50",
    textAccent: "text-purple-700",
    time: "約5秒",
  },
  {
    num: "03",
    icon: CheckCircle,
    title: "申請書を準備して提出",
    desc: "申請書テンプレートを自動生成。締め切りアラートで申請機会を逃さない。認定支援機関の紹介も可能。",
    detail: "採択までの流れ・必要書類・申請条件を分かりやすく解説",
    color: "from-green-500 to-emerald-600",
    bgAccent: "bg-green-50",
    textAccent: "text-green-700",
    time: "最短当日〜",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="howitworks" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">使い方</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            たった<span className="text-blue-600">3ステップ</span>で、<br className="sm:hidden" />
            補助金から申請書まで
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            専門知識ゼロでOK。事業内容を入力するだけで、AIが全てのステップをナビゲートします。
          </p>
        </div>

        {/* ステップ */}
        <div className="relative">
          {/* 縦線（デスクトップ） */}
          <div className="hidden lg:block absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 1;
              return (
                <div key={step.num} className={`relative lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center ${i > 0 ? "lg:mt-16" : ""}`}>

                  {/* コンテンツ（左右交互） */}
                  <div className={`${isEven ? "lg:order-2" : ""} mb-8 lg:mb-0`}>
                    {/* ステップ番号 */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-5xl font-extrabold bg-gradient-to-br ${step.color} bg-clip-text text-transparent leading-none`}>
                        {step.num}
                      </span>
                      <div className={`flex items-center gap-1.5 ${step.bgAccent} rounded-full px-3 py-1`}>
                        <Clock className={`w-3 h-3 ${step.textAccent}`} />
                        <span className={`text-xs font-semibold ${step.textAccent}`}>{step.time}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-4">{step.desc}</p>
                    <div className={`${step.bgAccent} rounded-xl p-4 border-l-4 border-current ${step.textAccent}`}>
                      <p className={`text-sm ${step.textAccent} font-medium`}>{step.detail}</p>
                    </div>
                  </div>

                  {/* ビジュアル（左右交互） */}
                  <div className={`${isEven ? "lg:order-1" : ""} relative`}>
                    {/* 中央の丸（縦線用） */}
                    <div className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isEven ? "-translate-x-[calc(50%+8rem)]" : "translate-x-[calc(50%+8rem-100%)]"} w-14 h-14 rounded-full bg-gradient-to-br ${step.color} items-center justify-center shadow-xl z-10`}
                      style={{ left: isEven ? "calc(100% + 1rem)" : "-2rem" }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 text-white shadow-xl`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white/90">Step {step.num}</span>
                      </div>
                      {i === 0 && <StepOneVisual />}
                      {i === 1 && <StepTwoVisual />}
                      {i === 2 && <StepThreeVisual />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/auth/signin"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5" />
            無料でAIマッチングを試す
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-gray-400 text-sm mt-3">クレジットカード不要 · 登録30秒</p>
        </div>
      </div>
    </section>
  );
}

function StepOneVisual() {
  return (
    <div className="space-y-3">
      <div className="bg-white/10 rounded-xl p-3">
        <p className="text-xs text-white/60 mb-1">事業内容・課題</p>
        <p className="text-sm text-white font-medium">ECサイト運営・在庫管理の老朽化が課題。DXを検討中。</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-lg p-2.5">
          <p className="text-xs text-white/60">業種</p>
          <p className="text-sm font-semibold text-white">小売業</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2.5">
          <p className="text-xs text-white/60">従業員数</p>
          <p className="text-sm font-semibold text-white">11〜20名</p>
        </div>
      </div>
    </div>
  );
}

function StepTwoVisual() {
  return (
    <div className="space-y-2">
      {[
        { name: "IT導入補助金", score: 94, amt: "450万円" },
        { name: "小規模事業者持続化", score: 87, amt: "200万円" },
        { name: "ものづくり補助金", score: 81, amt: "1,250万円" },
      ].map((r, i) => (
        <div key={i} className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-white/60 text-xs w-5">{i + 1}.</span>
            <span className="text-sm font-medium text-white truncate">{r.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-white/70">{r.score}%</span>
            <span className="text-sm font-bold text-yellow-300">{r.amt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepThreeVisual() {
  return (
    <div className="space-y-3">
      <div className="bg-white/10 rounded-xl p-3">
        <p className="text-xs text-white/60 mb-2">申請ステップ</p>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {["GビズID取得", "IT支援事業者を選定", "ツールを決定", "電子申請", "導入・報告"].map((s, i) => (
            <span key={i} className="bg-white/20 rounded px-2 py-0.5 text-white">{i + 1}. {s}</span>
          ))}
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-2.5 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
        <p className="text-xs text-white">締め切り：2025/7/31（残り80日）</p>
      </div>
    </div>
  );
}
