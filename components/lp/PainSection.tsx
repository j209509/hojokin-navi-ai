/*
 * PainSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 課題共感セクション（4部構成）
 * ① チェックリスト形式の悩み訴求
 * ② 従来の解決策とその限界（3列カード）
 * ③ 補助金ナビAIが解決します（グリーン背景ブロック）
 * ④ ROICalculator 埋め込み
 *
 * SmartHR スタイル: 課題 → 限界 → 解決策 の王道ストーリー構成
 */

import { XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import ROICalculator from "./ROICalculator";

const PAIN_POINTS = [
  "補助金があることは知っているが、自社に合うものが見つからない",
  "行政のWebサイトが複雑で、どれが対象かわからない",
  "締切を過ぎてから気づいて、また来年…を繰り返している",
  "申請書の書き方がわからず、途中で諦めてしまった",
  "社労士・行政書士に頼むと費用が高くて依頼しにくい",
  "補助金を取れたのかどうか、採択結果すら追えていない",
];

const ALTERNATIVES = [
  {
    title: "行政窓口・商工会議所に相談",
    icon: "🏢",
    color: "border-orange-200 bg-orange-50",
    iconBg: "bg-orange-100",
    limit: "予約待ち1〜2ヶ月・平日昼間しか対応不可・担当者により情報の質が異なる",
    limitPoints: [
      "予約待ち1〜2ヶ月",
      "平日昼間のみ（営業時間の制約）",
      "担当者によって情報の質がバラバラ",
    ],
  },
  {
    title: "社労士・行政書士に依頼",
    icon: "👔",
    color: "border-red-200 bg-red-50",
    iconBg: "bg-red-100",
    limit: "着手金5万円〜・成功報酬10〜20%・レスポンスに数日かかる",
    limitPoints: [
      "着手金5万円〜（採択されなくても費用発生）",
      "成功報酬10〜20%（100万円採択で10〜20万円）",
      "レスポンスまで数日〜1週間",
    ],
  },
  {
    title: "自力でWebサイトを検索",
    icon: "🔍",
    color: "border-yellow-200 bg-yellow-50",
    iconBg: "bg-yellow-100",
    limit: "情報が各省庁・自治体に分散・更新が遅い・専門用語で理解困難",
    limitPoints: [
      "情報が各省庁・自治体・機構に分散",
      "更新が遅く、締切切れ情報も混在",
      "専門用語が難解で素人には判断困難",
    ],
  },
];

export default function PainSection() {
  return (
    <section id="pain" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">

        {/* ① チェックリスト */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase">Pain</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
              こんなことで悩んでいませんか？
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              補助金を活用したいのに、なぜか毎年同じところで詰まっている—
              それには明確な理由があります。
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="space-y-3.5">
              {PAIN_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-700 text-sm font-medium text-center">
                💡 これらは全て、「情報の非対称性」と「専門知識の壁」が原因です
              </p>
            </div>
          </div>
        </div>

        {/* ② これまでの解決策とその限界 */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-orange-500 tracking-[0.2em] uppercase">
              Current Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              これまでの解決策とその限界
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ALTERNATIVES.map((alt) => (
              <div
                key={alt.title}
                className={`rounded-2xl border-2 p-6 ${alt.color}`}
              >
                <div className={`w-11 h-11 ${alt.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {alt.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">{alt.title}</h3>
                <div className="space-y-2 mb-4">
                  {alt.limitPoints.map((pt) => (
                    <div key={pt} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600 leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-current/10 pt-3">
                  <p className="text-xs font-semibold text-gray-500">
                    でも…結局、これでも補助金を取れない事業者が大多数です
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ③ 補助金ナビAIが解決します */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 text-yellow-300" />
              Solution
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              補助金ナビAIが、これらを全て解決します
            </h2>
            <p className="text-green-100 text-base sm:text-lg leading-relaxed">
              AIが事業内容を理解し、全国2,400件の補助金データベースから最適なものを瞬時にマッチング。
              申請書の下書きまで自動生成するから、
              <strong className="text-white">専門知識ゼロでも採択率が上がります。</strong>
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { label: "検索時間", before: "平均12時間", after: "3分以内", icon: "⏱" },
                { label: "申請書作成", before: "数日〜1週間", after: "1〜2時間", icon: "📝" },
                { label: "コスト", before: "成功報酬10〜20%", after: "月額定額制", icon: "💰" },
              ].map((c) => (
                <div key={c.label} className="bg-white/10 rounded-xl p-4 text-left">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <p className="text-xs text-green-300 font-semibold mb-1">{c.label}</p>
                  <p className="text-xs text-green-200 line-through">{c.before}</p>
                  <p className="text-white font-bold text-sm">{c.after}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ④ ROI計算ツール */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase">ROI Calculator</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              あなたの会社の導入効果を試算する
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              スライダーを動かすだけでリアルタイムにROIを計算します
            </p>
          </div>
          <ROICalculator />
        </div>

      </div>
    </section>
  );
}
