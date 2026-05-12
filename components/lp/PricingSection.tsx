/*
 * PricingSection.tsx — 料金プラン
 */

import Link from "next/link";
import { CheckCircle, Zap, Star, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "スターター",
    price: "¥0",
    period: "永久無料",
    desc: "まず試してみたい方へ",
    highlight: false,
    badge: null,
    features: [
      "AIマッチング 月3回",
      "補助金検索 月10回",
      "マッチング履歴（直近3件）",
      "申請書テンプレート（5種）",
      "補助金データベース閲覧",
    ],
    notIncluded: [
      "無制限AIマッチング",
      "締め切りアラート",
      "詳細分析レポート",
    ],
    cta: "無料で始める",
    ctaClass: "bg-gray-900 hover:bg-gray-800 text-white",
  },
  {
    name: "スタンダード",
    price: "¥9,800",
    period: "月額（税込）",
    desc: "本格的に補助金獲得を目指す方へ",
    highlight: true,
    badge: "🔥 最人気プラン",
    features: [
      "AIマッチング 無制限",
      "補助金検索 無制限",
      "マッチング履歴 無制限保存",
      "申請書テンプレート（全種）",
      "補助金データベース閲覧",
      "締め切りアラート通知",
      "PDF申請書エクスポート",
      "優先メールサポート",
    ],
    notIncluded: [],
    cta: "14日間無料トライアル",
    ctaClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30",
  },
  {
    name: "プレミアム",
    price: "¥29,800",
    period: "月額（税込）",
    desc: "複数の補助金を同時に狙う方へ",
    highlight: false,
    badge: null,
    features: [
      "スタンダードの全機能",
      "AIコンサルティングチャット",
      "認定支援機関のマッチング",
      "採択成功事例レポート",
      "申請書AI添削機能",
      "複数案件の同時管理",
      "専任サポート担当者",
      "オンライン相談（月1回）",
    ],
    notIncluded: [],
    cta: "プレミアムを試す",
    ctaClass: "bg-gray-900 hover:bg-gray-800 text-white",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">料金プラン</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            補助金1件採択で、<span className="text-blue-600">元が取れる</span>料金設定
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            平均採択額は数百万円。月額9,800円のサービスで数百万円を取りに行く。費用対効果は圧倒的です。
          </p>
        </div>

        {/* プランカード */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl flex flex-col ${
                plan.highlight
                  ? "bg-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {/* バッジ */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-7 flex-1 flex flex-col">
                <div className="mb-6">
                  <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                  <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${plan.highlight ? "text-blue-600" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signin"
                  className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all hover:-translate-y-0.5 ${plan.ctaClass}`}
                >
                  {plan.highlight && <Zap className="w-4 h-4" />}
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 安心メッセージ */}
        <div className="text-center mt-10 space-y-2">
          <div className="flex items-center justify-center gap-6 flex-wrap text-gray-500 text-sm">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />いつでも解約可能</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />クレジットカード必須（有料プランのみ）</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />Stripe決済で安全・安心</span>
          </div>
          <p className="text-gray-400 text-xs">
            ※ 表示価格はすべて税込。14日間の無料トライアル期間中は課金されません。
          </p>
        </div>

        {/* ROI訴求 */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center max-w-3xl mx-auto">
          <Star className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
          <h3 className="text-2xl font-extrabold mb-2">補助金1件採択で、プラン費用の100倍以上</h3>
          <p className="text-blue-100 text-sm mb-4">
            スタンダードプランの年間費用：¥117,600。<br />
            IT導入補助金の平均採択額：約180万円。<strong className="text-yellow-300">投資対効果 約15倍</strong>。
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-xl"
          >
            <Zap className="w-4 h-4" />無料プランで今すぐ試す
          </Link>
        </div>
      </div>
    </section>
  );
}
