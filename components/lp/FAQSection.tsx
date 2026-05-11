/*
 * FAQSection.tsx
 * ─────────────────────────────────────────────────────────────
 * アコーディオン形式のよくある質問
 * "use client" でアコーディオンの開閉状態を管理
 */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "どんな補助金に対応していますか？",
    a: "経済産業省・中小企業庁・厚労省・農水省・環境省・各都道府県・市区町村の補助金・助成金に対応しています。IT導入補助金、ものづくり補助金、小規模事業者持続化補助金、事業再構築補助金、キャリアアップ助成金など主要な補助金2,400件以上を収録。毎週データを更新しています。",
  },
  {
    q: "補助金の知識がなくても使えますか？",
    a: "はい、補助金の知識がまったくなくても大丈夫です。業種・事業内容・従業員数などを日本語で入力するだけで、AIが最適な補助金を推奨します。申請書類もテンプレートが用意されているので、初めての方でもスムーズに申請を進められます。",
  },
  {
    q: "無料プランでどこまで使えますか？",
    a: "無料プランでは月10回の補助金検索・月3回のAIマッチング・5件のテンプレートが利用できます。まずは無料でお試しいただき、本格的に活用したい場合はスタンダードプラン（14日間無料トライアル）へのアップグレードをお勧めします。",
  },
  {
    q: "採択の保証はありますか？",
    a: "採択の保証はしておりませんが、過去の採択データを活用した最適化により、ユーザーの採択率は平均62%（業界平均比+24%）を達成しています。申請書テンプレートとAIによる文章最適化で採択確率を高めます。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約できます。月次払いの場合は翌月から、年次払いの場合は次の更新タイミングからキャンセルが適用されます。解約後も残りの契約期間中はご利用いただけます。",
  },
  {
    q: "データのセキュリティは大丈夫ですか？",
    a: "銀行レベルのAES-256暗号化を採用し、SOC 2 Type II 準拠のセキュリティ体制を整えています。事業情報は第三者に提供することはありません。入力された事業データはAIマッチングの精度向上のみに使用します。",
  },
  {
    q: "既に社労士・行政書士に依頼しているのですが、併用できますか？",
    a: "はい、専門家との併用をお勧めします。補助金ナビAIで補助金候補の発見・スクリーニングを行い、申請書の下書きまで作成した上で、最終確認・提出を専門家に依頼することで、コストを抑えながら質の高い申請が実現します。",
  },
  {
    q: "地方の企業でも利用できますか？",
    a: "全国対応しています。全国47都道府県・1,700以上の市区町村の地域限定補助金もデータベースに収録しており、お客様の所在地に応じた地域補助金を自動的に優先表示します。都市部だけでなく地方の事業者様にこそ活用していただきたいサービスです。",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            よくある質問
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
              >
                <span className="font-semibold text-gray-900 text-sm pr-4 leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIdx === i ? "rotate-180 text-blue-500" : ""
                  }`}
                />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            他にご不明な点がございましたら、
            <a
              href="/auth/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              チャットサポート
            </a>
            よりお気軽にお問い合わせください。
          </p>
        </div>
      </div>
    </section>
  );
}
