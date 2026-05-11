/*
 * PricingSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 料金プラン（Phase 1〜5 で実装済みの料金をそのまま使用）
 * - スターター: ¥0/月（永久無料）
 * - スタンダード: ¥9,800/月（人気No.1・highlighted）
 * - プレミアム: ¥29,800/月
 *
 * Chatwork スタイル: 料金比較表で意思決定を明確化
 */

import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "スターター",
    price: "0",
    period: "永久無料",
    desc: "まずは試してみたい方に",
    features: [
      "補助金検索（月10回）",
      "AIマッチング（月3回）",
      "テンプレート5件",
      "申請状況管理（3件まで）",
      "メールサポート",
    ],
    notIncluded: ["締切アラート", "申請書自動生成", "優先サポート"],
    cta: "無料で始める",
    ctaLink: "/auth/signin",
    highlighted: false,
    badge: null,
  },
  {
    name: "スタンダード",
    price: "9,800",
    period: "月額（税込）",
    desc: "本格的に活用したい中小企業に",
    features: [
      "補助金検索（無制限）",
      "AIマッチング（無制限）",
      "テンプレート全件（200+）",
      "申請状況管理（無制限）",
      "締切アラート",
      "申請書下書き自動生成",
      "チャットサポート",
    ],
    notIncluded: ["専任コンサルタント", "電話サポート"],
    cta: "14日間無料トライアル",
    ctaLink: "/auth/signin",
    highlighted: true,
    badge: "人気No.1",
  },
  {
    name: "プレミアム",
    price: "29,800",
    period: "月額（税込）",
    desc: "最大限の成果を求める企業に",
    features: [
      "スタンダードの全機能",
      "専任コンサルタント",
      "申請書類レビュー",
      "優先サポート（電話対応）",
      "採択率レポート（詳細版）",
      "カスタム分析・レポート",
    ],
    notIncluded: [],
    cta: "お問い合わせ",
    ctaLink: "/auth/signin",
    highlighted: false,
    badge: null,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
            シンプルな料金プラン
          </h2>
          <p className="text-gray-500 text-sm">
            まずは無料から。いつでもアップグレード・解約できます。年額払いで2ヶ月分お得。
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-7 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl shadow-blue-200 ring-2 ring-blue-400/30 scale-105"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3
                className={`font-bold text-lg mb-1 ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p className={`text-xs mb-5 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                {plan.desc}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ¥{plan.price}
                  </span>
                  <span className={`text-sm mb-1.5 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                    /{plan.period}
                  </span>
                </div>
                {plan.highlighted && (
                  <p className="text-blue-200 text-xs mt-1">
                    年額払い: ¥98,000/年（2ヶ月分お得）
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle
                      className={`w-4 h-4 flex-shrink-0 ${
                        plan.highlighted ? "text-yellow-400" : "text-green-500"
                      }`}
                    />
                    <span className={plan.highlighted ? "text-blue-100" : "text-gray-700"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaLink}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                  plan.highlighted
                    ? "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-lg"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                {plan.highlighted && <Sparkles className="w-4 h-4" />}
                {plan.cta}
              </Link>

              {plan.highlighted && (
                <p className="text-center text-blue-300 text-xs mt-2">
                  14日間は完全無料・カード不要
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Comparison note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            社労士・行政書士への依頼（月平均5万円〜）と比べて、
            <span className="font-bold text-blue-600">スタンダードプランは月9,800円。</span>
            採択率も上がって、コストは大幅ダウン。
          </p>
        </div>
      </div>
    </section>
  );
}
