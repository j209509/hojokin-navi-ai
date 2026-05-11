/*
 * DogfoodingSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 自己実証セクション：補助金ナビAI自身が補助金を活用している事実を示す
 * 「自分たちも使っている」という一次情報が最強の信頼証明
 */

import { CheckCircle, Clock, Award } from "lucide-react";

const ACHIEVEMENTS = [
  {
    name: "IT導入補助金",
    status: "採択済み",
    statusType: "adopted" as const,
    amount: "150万円",
    detail: "本サービスのシステム開発・クラウドインフラ整備に活用",
    icon: "💻",
  },
  {
    name: "事業再構築補助金",
    status: "申請中",
    statusType: "pending" as const,
    amount: "500万円",
    detail: "AIエンジン強化・データベース拡充への投資に申請",
    icon: "🚀",
  },
  {
    name: "小規模事業者持続化補助金",
    status: "採択済み",
    statusType: "adopted" as const,
    amount: "50万円",
    detail: "このランディングページを含むマーケティング施策に活用",
    icon: "📈",
  },
];

const STATUS_CONFIG = {
  adopted: {
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  pending: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
};

export default function DogfoodingSection() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            Self-Proof
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            補助金ナビAI自身も、
            <br />
            補助金で成長しています
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            私たちは自社プロダクトを最大限に活用しています。補助金ナビAIを使って発見した
            IT導入補助金・事業再構築補助金で、このサービス自体の開発・運用コストを補助金で賄いました。
            <strong className="text-blue-700">ツールの効果を自ら体感しているからこそ、自信を持ってお勧めできます。</strong>
          </p>
        </div>

        {/* Achievement cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {ACHIEVEMENTS.map((a) => {
            const statusCfg = STATUS_CONFIG[a.statusType];
            return (
              <div
                key={a.name}
                className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{a.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusCfg.badge}`}
                  >
                    {statusCfg.icon}
                    {a.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">{a.name}</h3>
                <p className="text-2xl font-extrabold text-blue-600 mb-2">{a.amount}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{a.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Self-reference note */}
        <div className="bg-blue-600/10 border border-blue-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📄</span>
            <div>
              <p className="font-bold text-blue-900 mb-1 text-sm">
                このランディングページ自体も、補助金ナビAIで活用しています
              </p>
              <p className="text-blue-700 text-xs leading-relaxed">
                このページのデザイン・制作費用の一部は、補助金ナビAIで発見した
                「小規模事業者持続化補助金」を活用して賄っています。
                私たちは「自分たちが使えないツールを他者に勧めない」というポリシーを持っています。
              </p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            補助金ナビAI自身の累計補助金獲得・申請額
          </p>
          <p className="text-4xl font-extrabold text-blue-600 mt-1">
            700万円以上
          </p>
          <p className="text-xs text-gray-400 mt-1">
            （採択済み150万円 + 申請中500万円 + 採択済み50万円）
          </p>
        </div>
      </div>
    </section>
  );
}
