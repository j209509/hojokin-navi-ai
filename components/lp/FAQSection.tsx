"use client";
/*
 * FAQSection.tsx — よくある質問（アコーディオン）
 */

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "無料プランでどこまで使えますか？",
    a: "無料プランでは月10回の補助金検索・月3回のAIマッチング・5件の申請書テンプレートが利用できます。補助金が見つかるかどうかをまず確認するのに十分な機能です。クレジットカード登録不要で今すぐ始められます。",
  },
  {
    q: "補助金の採択は保証されますか？",
    a: "採択の保証はしておりません。ただし、当社ユーザーの採択率は平均62%（業界平均38%比+24ポイント）を達成しています。AIが適合度の高い補助金のみを提示するため、無駄な申請作業が大幅に削減されます。",
  },
  {
    q: "対応している補助金の種類は？",
    a: "経済産業省・中小企業庁・厚生労働省・農林水産省・環境省・国土交通省・デジタル庁など国の補助金から、都道府県・市区町村の地域補助金まで、全国2,891件（2026年5月時点）に対応しています。毎週自動更新されます。",
  },
  {
    q: "申請書の代行・行政書士業務には対応していますか？",
    a: "申請書類の作成代行・代理申請は行政書士の独占業務のため、当社では対応しておりません。ただし、申請書の「下書き・テンプレート生成」「必要書類の一覧化」「申請ステップの案内」は提供しています。認定支援機関・行政書士のご紹介も可能です。",
  },
  {
    q: "個人事業主・フリーランスでも使えますか？",
    a: "はい。小規模事業者持続化補助金・IT導入補助金・創業補助金など、個人事業主・フリーランス向けの補助金も多数対応しています。業種・規模を選ばずご利用いただけます。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約できます。解約はアカウント設定画面から手続き可能で、解約月末日まで有料機能をご利用いただけます。日割り返金は原則として行っておりませんが、詳しくは特定商取引法に基づく表記をご確認ください。",
  },
  {
    q: "データのセキュリティは大丈夫ですか？",
    a: "はい。データはAES-256暗号化・SSL/TLS通信で保護されています。Supabase（PostgreSQL）でのセキュアなデータ管理、Vercelのエンタープライズグレードのホスティングを採用しています。事業情報をAI処理に使用する際はAnthropicのAPIを利用しますが、個人情報の提供はありません。",
  },
  {
    q: "補助金情報はどこから取得していますか？",
    a: "経済産業省が運営する公式補助金検索システム「jGrants」APIから取得・同期しています。毎週月曜日に自動更新されるため、最新の補助金情報を常に参照できます。",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            よくある質問
          </h2>
          <p className="text-gray-500 text-base">
            解決しない場合は<Link href="/contact" className="text-blue-600 hover:underline font-medium">お問い合わせページ</Link>よりご連絡ください。
          </p>
        </div>

        {/* アコーディオン */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 ${
                open === i ? "border-blue-200 shadow-md shadow-blue-50" : "border-gray-100"
              }`}
            >
              <button
                className="w-full text-left px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 text-sm sm:text-base flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                    open === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    Q
                  </span>
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-200 text-gray-400 ${
                  open === i ? "rotate-180 text-blue-600" : ""
                }`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <div className="pl-9">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* お問い合わせ誘導 */}
        <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">他にご質問がございますか？</p>
            <p className="text-gray-500 text-xs mt-0.5">平日10:00〜18:00に対応。2営業日以内にご返信します。</p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            お問い合わせ →
          </Link>
        </div>
      </div>
    </section>
  );
}
