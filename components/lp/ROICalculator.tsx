/*
 * ROICalculator.tsx
 * ─────────────────────────────────────────────────────────────
 * インタラクティブROI計算ツール（LP最重要コンポーネント）
 *
 * 計算ロジック:
 *  - 年間削減時間 = 月間調査時間 × 12 × 0.75
 *  - 人件費削減   = 年間削減時間 × 2,500円
 *  - 期待収益増   = 申請額中央値（万円）× 年間申請回数 × 0.23
 *  - ツール費用   = スタンダードプラン ¥9,800/月 × 12 = ¥117,600/年
 *  - 年間ROI      = (人件費削減 + 期待収益増×10000 - ツール費用) / ツール費用 × 100
 *
 * freee・マネーフォワード スタイル: ROI数値を前面に出して意思決定を加速
 */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, TrendingUp, Clock, Banknote, ArrowRight } from "lucide-react";

const INDUSTRIES = [
  "製造業",
  "IT・ソフトウェア",
  "小売・サービス",
  "飲食・宿泊",
  "建設・土木",
  "医療・介護",
  "その他",
];

const AMOUNT_OPTIONS = [
  { label: "50万円未満", median: 25 },
  { label: "50〜100万円", median: 75 },
  { label: "100〜500万円", median: 300 },
  { label: "500万円以上", median: 750 },
];

const TOOL_COST_YEN = 9800 * 12; // ¥117,600/年

export default function ROICalculator() {
  const [industry, setIndustry] = useState("製造業");
  const [employees, setEmployees] = useState(30);
  const [monthlyHours, setMonthlyHours] = useState(10);
  const [applications, setApplications] = useState(3);
  const [amountIndex, setAmountIndex] = useState(2); // 100〜500万円

  const result = useMemo(() => {
    const savedHours = monthlyHours * 12 * 0.75;
    const laborSavingsYen = savedHours * 2500;
    const medianAmount = AMOUNT_OPTIONS[amountIndex].median;
    const revenueIncreaseYen = medianAmount * 10000 * applications * 0.23;
    const totalBenefit = laborSavingsYen + revenueIncreaseYen;
    const roi = ((totalBenefit - TOOL_COST_YEN) / TOOL_COST_YEN) * 100;
    return {
      savedHours: Math.round(savedHours),
      laborSavings: Math.round(laborSavingsYen / 10000),
      revenueIncrease: Math.round(revenueIncreaseYen / 10000),
      roi: Math.round(roi),
    };
  }, [monthlyHours, applications, amountIndex]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">ROI計算ツール</h3>
            <p className="text-blue-200 text-xs">あなたの会社の導入効果を今すぐ試算</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid lg:grid-cols-2 gap-6">
        {/* ── Inputs ── */}
        <div className="space-y-5">
          <h4 className="font-semibold text-gray-800 text-sm">事業情報を入力</h4>

          {/* 業種 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">業種</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* 従業員数 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-600">従業員数</label>
              <span className="text-sm font-bold text-blue-600">{employees}名</span>
            </div>
            <input
              type="range"
              min={1}
              max={300}
              step={10}
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1名</span>
              <span>300名</span>
            </div>
          </div>

          {/* 月間調査時間 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-600">月間の補助金調査時間</label>
              <span className="text-sm font-bold text-blue-600">{monthlyHours}時間/月</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={monthlyHours}
              onChange={(e) => setMonthlyHours(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0時間</span>
              <span>40時間</span>
            </div>
          </div>

          {/* 年間申請回数 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-600">年間の補助金申請回数</label>
              <span className="text-sm font-bold text-blue-600">{applications}回/年</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={applications}
              onChange={(e) => setApplications(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0回</span>
              <span>10回</span>
            </div>
          </div>

          {/* 平均申請額 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">平均的な補助金申請額</label>
            <div className="grid grid-cols-2 gap-2">
              {AMOUNT_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={() => setAmountIndex(idx)}
                  className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                    amountIndex === idx
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 text-sm">試算結果（年間）</h4>

          <div className="grid grid-cols-2 gap-3">
            {/* 削減時間 */}
            <ResultCard
              icon={<Clock className="w-4 h-4" />}
              label="年間削減時間"
              value={`${result.savedHours.toLocaleString()}時間`}
              color="blue"
              note="年間調査時間の75%を削減"
            />
            {/* 人件費削減 */}
            <ResultCard
              icon={<Banknote className="w-4 h-4" />}
              label="人件費削減額"
              value={`${result.laborSavings.toLocaleString()}万円`}
              color="green"
              note="時給2,500円換算"
            />
            {/* 期待収益増 */}
            <ResultCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="補助金期待収益増"
              value={`${result.revenueIncrease.toLocaleString()}万円`}
              color="purple"
              note="採択率+23%向上による試算"
            />
            {/* ROI */}
            <ResultCard
              icon={<Calculator className="w-4 h-4" />}
              label="年間ROI"
              value={`${result.roi > 0 ? "+" : ""}${result.roi.toLocaleString()}%`}
              color="yellow"
              note={`ツール費用: 年間${(TOOL_COST_YEN / 10000).toFixed(1)}万円`}
              highlight
            />
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 leading-relaxed">
            ※ 上記は試算値です。実際の効果は企業規模・業種・補助金の種類によって異なります。
            採択保証ではありません。
          </p>

          {/* CTA */}
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-yellow-400/20 text-sm"
          >
            この結果をもとに無料で始める
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center text-xs text-gray-400">登録30秒 · クレジットカード不要</p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  color,
  note,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "yellow";
  note: string;
  highlight?: boolean;
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500" },
    green: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "text-purple-500" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "text-yellow-500" },
  };
  const c = colorMap[color];

  return (
    <div
      className={`rounded-xl p-3 ${highlight ? "ring-2 ring-yellow-400" : ""} ${c.bg}`}
    >
      <div className={`flex items-center gap-1.5 mb-1.5 ${c.icon}`}>
        {icon}
        <span className="text-xs font-semibold text-gray-600">{label}</span>
      </div>
      <p className={`text-xl font-extrabold ${c.text} leading-tight`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{note}</p>
    </div>
  );
}
