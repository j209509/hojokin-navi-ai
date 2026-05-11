/*
 * CoverageSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 対応省庁・自治体グリッド + 補助金カテゴリタグクラウド
 * 「全国47都道府県対応」の信頼感を訴求
 */

const MINISTRIES = [
  { name: "経済産業省", abbr: "経産省", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { name: "厚生労働省", abbr: "厚労省", color: "bg-green-100 text-green-800 border-green-200" },
  { name: "農林水産省", abbr: "農水省", color: "bg-lime-100 text-lime-800 border-lime-200" },
  { name: "国土交通省", abbr: "国交省", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { name: "中小企業庁", abbr: "中企庁", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { name: "中小機構", abbr: "中小機構", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
];

const PREFECTURES = [
  "東京都", "大阪府", "愛知県", "神奈川県", "埼玉県", "千葉県",
  "福岡県", "北海道", "宮城県", "広島県", "全国その他37都道府県",
];

const SUBSIDY_TAGS = [
  { name: "ものづくり補助金", hot: true },
  { name: "IT導入補助金", hot: true },
  { name: "小規模事業者持続化補助金", hot: true },
  { name: "事業再構築補助金", hot: true },
  { name: "キャリアアップ助成金", hot: false },
  { name: "業務改善助成金", hot: false },
  { name: "人材開発支援助成金", hot: false },
  { name: "省エネルギー投資促進支援事業費補助金", hot: false },
  { name: "創業補助金", hot: false },
  { name: "地域未来投資促進補助金", hot: false },
  { name: "その他1,400件以上…", hot: false },
];

export default function CoverageSection() {
  return (
    <section id="coverage" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase">Coverage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
            全国の補助金を一括管理
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            全国47都道府県・1,700以上の市区町村の補助金に対応。
            あなたの地域・業種・規模に合った補助金を見逃しません。
          </p>
        </div>

        {/* Ministries */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
            省庁・主要機関
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MINISTRIES.map((m) => (
              <div
                key={m.name}
                className={`border rounded-xl px-3 py-3.5 text-center ${m.color}`}
              >
                <p className="font-bold text-sm">{m.abbr}</p>
                <p className="text-xs opacity-70 mt-0.5 leading-tight">{m.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prefectures */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
            対応都道府県（例）
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {PREFECTURES.map((pref) => (
              <span
                key={pref}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  pref.includes("その他")
                    ? "bg-gray-100 text-gray-500 border-gray-200 italic"
                    : "bg-white text-gray-700 border-gray-200 shadow-sm"
                }`}
              >
                {pref}
              </span>
            ))}
          </div>
        </div>

        {/* Subsidy tag cloud */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
            対応補助金カテゴリ（一部）
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUBSIDY_TAGS.map((tag) => (
              <span
                key={tag.name}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  tag.hot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {tag.hot && <span className="mr-1">🔥</span>}
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="text-sm font-bold text-blue-900">
                対応補助金数は常時2,400件以上
              </p>
              <p className="text-xs text-blue-600">
                毎週データ更新・新規補助金を随時追加
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
