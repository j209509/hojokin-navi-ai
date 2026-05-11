/*
 * TestimonialsSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 導入事例・お客様の声（3件）
 * マネーフォワード スタイル: 具体的な金額・数値を前面に出して信頼感を演出
 */

import { Star, Award, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "田中 一郎",
    title: "株式会社テクノソリューション",
    role: "代表取締役",
    avatar: "田",
    avatarColor: "bg-blue-600",
    industry: "IT・ソフトウェア / 従業員28名",
    text: "IT導入補助金の申請をこれまで自力でやっていましたが、補助金ナビAIを使ったら必要な補助金を3分で見つけられました。申請書のテンプレートが優秀で、書類作成時間が従来の4分の1に。昨年は合計380万円を獲得できました。",
    amount: "年間獲得 380万円",
    rating: 5,
    tags: ["IT導入補助金", "ものづくり補助金"],
    beforeAfter: { before: "自力で週2時間の調査", after: "3分でマッチング完了" },
  },
  {
    name: "佐藤 美香",
    title: "さとう食堂",
    role: "オーナー",
    avatar: "佐",
    avatarColor: "bg-emerald-500",
    industry: "飲食・宿泊 / 従業員8名",
    text: "飲食業は補助金が少ないと思っていましたが、小規模事業者持続化補助金やものづくり補助金など、意外と多くの補助金に対象になることがわかりました。書類テンプレートのおかげで初めての申請書も迷わず書けました。",
    amount: "年間獲得 200万円",
    rating: 5,
    tags: ["小規模事業者持続化補助金"],
    beforeAfter: { before: "諦めていた（対象外だと思っていた）", after: "2件採択" },
  },
  {
    name: "山本 健太",
    title: "合同会社ヤマモト製作所",
    role: "代表",
    avatar: "山",
    avatarColor: "bg-violet-500",
    industry: "製造業 / 従業員45名",
    text: "製造業向けの補助金情報をまとめて管理できるのが非常に便利です。複数の補助金を並行して申請していますが、締切アラートのおかげで1件も漏らさずに申請できています。採択率も大幅に改善しました。",
    amount: "年間獲得 1,200万円",
    rating: 5,
    tags: ["ものづくり補助金", "省エネ補助金", "事業再構築補助金"],
    beforeAfter: { before: "締切を毎年1〜2件見逃し", after: "100%申請完了" },
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-950 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-yellow-400 tracking-[0.2em] uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">
            導入企業の声
          </h2>
          <p className="text-blue-300 text-sm">
            全国2,400社以上の中小企業・個人事業主にご利用いただいています
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-yellow-400/60 mb-3" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-blue-100 text-sm leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Before/After */}
              <div className="bg-white/10 rounded-xl p-3 mb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-400 font-semibold flex-shrink-0">Before:</span>
                  <span className="text-blue-300 line-through">{t.beforeAfter.before}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400 font-semibold flex-shrink-0">After:</span>
                  <span className="text-white font-medium">{t.beforeAfter.after}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div
                  className={`w-10 h-10 ${t.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-blue-300 text-xs truncate">{t.title} / {t.role}</p>
                  <p className="text-blue-400 text-xs">{t.industry}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="inline-flex items-center gap-1.5 text-yellow-400 text-sm font-bold">
                  <Award className="w-4 h-4" />
                  {t.amount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          {[
            { value: "4.8", label: "平均評価（5点満点）", suffix: "⭐" },
            { value: "94.2%", label: "継続利用率", suffix: "" },
            { value: "¥4.8億", label: "累計補助金獲得支援額", suffix: "" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white font-extrabold text-2xl sm:text-3xl">
                {s.suffix}{s.value}
              </p>
              <p className="text-blue-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
