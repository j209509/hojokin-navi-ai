"use client";
/*
 * PainSection.tsx — 課題共感 → 解決訴求
 * "あなたの痛みを知っている" + 他の手段との比較
 */

import { X, CheckCircle, Clock, DollarSign, AlertTriangle } from "lucide-react";

const PAINS = [
  {
    icon: Clock,
    title: "補助金を探すだけで何時間も…",
    desc: "経産省・都道府県・市区町村…情報が分散していて、自社が対象かどうかすら分からない。調べるだけで半日が終わる。",
    color: "text-red-400",
    bg: "bg-red-950/40 border-red-800/40",
  },
  {
    icon: DollarSign,
    title: "行政書士に頼むと数十万円…",
    desc: "専門家に任せれば確実かもしれないが、着手金だけで20〜50万円。採択される保証もないのにリスクが高すぎる。",
    color: "text-orange-400",
    bg: "bg-orange-950/40 border-orange-800/40",
  },
  {
    icon: AlertTriangle,
    title: "締め切りを知らずに申請機会を逃す",
    desc: "「この補助金、先月締め切りだったのか…」気づいたときには遅い。毎年数百万円の機会損失が積み重なっている。",
    color: "text-yellow-400",
    bg: "bg-yellow-950/40 border-yellow-800/40",
  },
];

const COMPARISON = [
  {
    method: "補助金ナビAI",
    highlight: true,
    items: [
      { label: "費用", value: "¥0〜（無料プランあり）", ok: true },
      { label: "補助金発見時間", value: "5秒〜", ok: true },
      { label: "対応補助金数", value: "2,891件", ok: true },
      { label: "申請書テンプレート", value: "自動生成", ok: true },
      { label: "締め切りアラート", value: "あり", ok: true },
      { label: "24h利用可能", value: "◎", ok: true },
    ],
  },
  {
    method: "行政書士",
    highlight: false,
    items: [
      { label: "費用", value: "20〜50万円+", ok: false },
      { label: "補助金発見時間", value: "数日〜数週間", ok: false },
      { label: "対応補助金数", value: "数件〜数十件", ok: false },
      { label: "申請書テンプレート", value: "依頼ベース", ok: null },
      { label: "締め切りアラート", value: "なし", ok: false },
      { label: "24h利用可能", value: "×（営業時間内のみ）", ok: false },
    ],
  },
  {
    method: "自力検索",
    highlight: false,
    items: [
      { label: "費用", value: "¥0（時間コスト大）", ok: null },
      { label: "補助金発見時間", value: "数時間〜数日", ok: false },
      { label: "対応補助金数", value: "限定的", ok: false },
      { label: "申請書テンプレート", value: "なし", ok: false },
      { label: "締め切りアラート", value: "なし", ok: false },
      { label: "24h利用可能", value: "△", ok: null },
    ],
  },
];

export default function PainSection() {
  return (
    <section className="bg-gray-950 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ─ ペインブロック ─ */}
        <div className="text-center mb-16">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-3">あなたの悩み</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            補助金申請、<span className="text-red-400">こんな壁</span>にぶつかっていませんか？
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            多くの中小企業・個人事業主が、毎年数百万円の補助金を「知らない」「難しそう」「時間がない」という理由だけで逃しています。
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-20">
          {PAINS.map((p) => (
            <div key={p.title} className={`border rounded-2xl p-6 ${p.bg}`}>
              <p.icon className={`w-8 h-8 ${p.color} mb-4`} />
              <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* ─ 比較テーブル ─ */}
        <div className="text-center mb-10">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">解決策の比較</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            なぜ<span className="text-yellow-400">補助金ナビAI</span>が選ばれるのか
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium bg-gray-900 w-1/4">比較項目</th>
                {COMPARISON.map((c) => (
                  <th key={c.method} className={`py-4 px-6 text-center font-bold ${c.highlight ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-300"}`}>
                    {c.highlight && <span className="block text-xs font-normal text-blue-200 mb-0.5">✨ おすすめ</span>}
                    {c.method}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON[0].items.map((_, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-6 text-gray-400 bg-gray-900/50 font-medium">
                    {COMPARISON[0].items[rowIdx].label}
                  </td>
                  {COMPARISON.map((c) => {
                    const item = c.items[rowIdx];
                    return (
                      <td key={c.method} className={`py-3.5 px-6 text-center ${c.highlight ? "bg-blue-950/60 text-white font-semibold" : "text-gray-400"}`}>
                        <span className="flex items-center justify-center gap-1.5">
                          {item.ok === true && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                          {item.ok === false && <X className="w-4 h-4 text-red-400 flex-shrink-0" />}
                          {item.value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
