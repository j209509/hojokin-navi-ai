/*
 * TestimonialsSection.tsx — 社会的証明・お客様の声（具体的成果）
 */

import { Star, TrendingUp, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "山田 健太郎",
    role: "代表取締役",
    company: "製造業・従業員45名",
    avatar: "山",
    avatarBg: "bg-blue-600",
    result: "1,250万円採択",
    resultDetail: "ものづくり補助金",
    text: "自社に合う補助金を探すだけで毎回丸1日かかっていました。補助金ナビAIを使ったら5分でマッチング完了。しかもAIが「この補助金が最適な理由」まで説明してくれるので、申請書作成の方針もすぐ立てられました。",
    stars: 5,
  },
  {
    name: "佐藤 美咲",
    role: "個人事業主",
    company: "IT・デザイン業",
    avatar: "佐",
    avatarBg: "bg-purple-600",
    result: "450万円採択",
    resultDetail: "IT導入補助金",
    text: "フリーランスが補助金なんて関係ないと思っていましたが、試しに入力したら個人事業主も対象の補助金が複数見つかりました。申請書テンプレートのおかげで、初めての申請でも1週間で書類が揃いました。",
    stars: 5,
  },
  {
    name: "田中 誠司",
    role: "店長",
    company: "飲食業・3店舗展開",
    avatar: "田",
    avatarBg: "bg-orange-600",
    result: "200万円採択",
    resultDetail: "小規模事業者持続化補助金",
    text: "締め切り2週間前に偶然このサービスを知りました。普通なら絶対間に合わないと思いましたが、AIが必要書類と申請の流れを全部教えてくれて、なんとか間に合いました。逃していたら200万円の損失でした。",
    stars: 5,
  },
  {
    name: "鈴木 啓介",
    role: "経営企画部長",
    company: "建設業・従業員80名",
    avatar: "鈴",
    avatarBg: "bg-green-600",
    result: "3,000万円採択",
    resultDetail: "事業再構築補助金",
    text: "補助金コンサルに依頼すると着手金だけで30万円と言われ断念していました。補助金ナビAIなら月額9,800円で同等以上の情報量。実際に採択された今、投資対効果は200倍以上です。",
    stars: 5,
  },
  {
    name: "小林 恵子",
    role: "代表",
    company: "農業法人・有機農場",
    avatar: "小",
    avatarBg: "bg-emerald-600",
    result: "500万円採択",
    resultDetail: "農業競争力強化基盤整備事業",
    text: "農業系の補助金は情報が特に少なく、どこに問い合わせていいかも分かりませんでした。補助金ナビAIが農業専門の補助金も網羅していて驚きました。採択後は温室設備を一気に更新できました。",
    stars: 5,
  },
  {
    name: "中村 浩二",
    role: "代表取締役CEO",
    company: "IT・SaaS・従業員15名",
    avatar: "中",
    avatarBg: "bg-indigo-600",
    result: "7,000万円申請中",
    resultDetail: "事業再構築補助金（グリーン成長枠）",
    text: "スタートアップでも使えると知らなかった大型補助金をAIが発見してくれました。マッチ度97%の補助金で現在申請審査中。もし採択されたら事業フェーズが変わるレベルの金額です。",
    stars: 5,
  },
];

const OVERALL_STATS = [
  { label: "平均採択率", value: "62%", sub: "業界平均 38%比" },
  { label: "ユーザー満足度", value: "4.8/5", sub: "312件のレビュー" },
  { label: "平均マッチング時間", value: "5秒", sub: "2,891件から瞬時に" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">お客様の声</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            実際に<span className="text-blue-600">補助金を獲得</span>した方々の声
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            業種・規模を問わず、全国の中小企業・個人事業主が成果を出しています。
          </p>
        </div>

        {/* 総合実績 */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          {OVERALL_STATS.map((s) => (
            <div key={s.label} className="text-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-3xl font-extrabold text-blue-600 mb-1">{s.value}</p>
              <p className="text-sm font-semibold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* カードグリッド */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-300 relative"
            >
              {/* 採択バッジ */}
              <div className="absolute -top-3 right-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {t.result}
                </div>
              </div>

              {/* 引用マーク */}
              <Quote className="w-8 h-8 text-blue-100 mb-3" />

              {/* テキスト */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">{t.text}</p>

              {/* 補助金名 */}
              <div className="bg-blue-50 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-blue-500 font-medium">採択補助金</p>
                <p className="text-sm font-bold text-blue-800">{t.resultDetail}</p>
              </div>

              {/* プロフィール + 星 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.avatarBg} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role} · {t.company}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(t.stars)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ボトムCTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-2">あなたも補助金を獲得できます</p>
          <a
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
          >
            無料で始める →
          </a>
        </div>
      </div>
    </section>
  );
}
