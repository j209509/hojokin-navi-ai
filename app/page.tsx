"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  CheckCircle,
  BarChart3,
  FileText,
  Database,
  BookOpen,
  Star,
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Building2,
  Award,
  Clock,
  ChevronDown,
} from "lucide-react";

/* ─── データ定義 ─────────────────────────────────── */

const features = [
  {
    icon: Sparkles,
    title: "AIマッチング",
    desc: "事業内容を入力するだけで最適な補助金をAIが自動推奨。127件以上のデータベースから御社にぴったりの補助金を瞬時に発見します。",
    color: "from-yellow-400 to-orange-400",
    bg: "bg-yellow-50",
    link: "/dashboard",
  },
  {
    icon: Database,
    title: "補助金データベース",
    desc: "経産省・厚労省・自治体の補助金を一元管理。リアルタイムで更新される127件以上のデータベースを全文検索できます。",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    link: "/dashboard",
  },
  {
    icon: FileText,
    title: "申請状況管理",
    desc: "申請から採択まで進捗をリアルタイム管理。必要書類チェックリストと締切アラートで申請漏れをゼロにします。",
    color: "from-green-400 to-green-600",
    bg: "bg-green-50",
    link: "/dashboard",
  },
  {
    icon: BookOpen,
    title: "テンプレートライブラリ",
    desc: "採択率の高い事業計画書・申請書類のテンプレートを提供。プロが作成した雛形で申請書類作成の時間を80%削減。",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    link: "/dashboard",
  },
  {
    icon: BarChart3,
    title: "採択率分析",
    desc: "過去の申請データを分析し採択率を向上。月別の獲得金額推移や申請状況をビジュアルで把握できます。",
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    link: "/dashboard",
  },
  {
    icon: Shield,
    title: "セキュリティ",
    desc: "企業の機密情報を銀行レベルの暗号化で保護。SOC 2 Type II 準拠のセキュリティで安心してご利用いただけます。",
    color: "from-slate-400 to-slate-600",
    bg: "bg-slate-50",
    link: "/dashboard",
  },
];

const steps = [
  {
    step: "01",
    title: "事業内容を入力",
    desc: "業種・従業員数・事業の課題をフォームに入力するだけ。難しい専門知識は不要です。",
    icon: FileText,
  },
  {
    step: "02",
    title: "AIが最適な補助金を推奨",
    desc: "127件以上のデータベースをAIが瞬時に分析。マッチ度スコア付きで5〜10件を自動推奨します。",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "申請から採択まで管理",
    desc: "テンプレートで書類を作成し、進捗を管理。締切アラートで申請漏れを防ぎます。",
    icon: CheckCircle,
  },
];

const testimonials = [
  {
    name: "田中 一郎",
    title: "株式会社テクノソリューション 代表取締役",
    avatar: "田",
    color: "bg-blue-500",
    text: "IT導入補助金の申請をこれまで自力でやっていましたが、補助金ナビAIを使ったら必要な補助金を3分で見つけられました。採択率も大幅に改善し、昨年は合計380万円を獲得できました。",
    amount: "獲得金額 380万円",
    stars: 5,
  },
  {
    name: "佐藤 美香",
    title: "さとう食堂 オーナー",
    avatar: "佐",
    color: "bg-green-500",
    text: "飲食業は補助金が少ないと思っていましたが、小規模事業者持続化補助金やものづくり補助金など、意外と多くの補助金に対象になることがわかりました。書類テンプレートのおかげで申請も楽でした。",
    amount: "獲得金額 200万円",
    stars: 5,
  },
  {
    name: "山本 健太",
    title: "合同会社ヤマモト製作所 代表",
    avatar: "山",
    color: "bg-purple-500",
    text: "製造業向けの補助金情報をまとめて管理できるのが非常に便利です。複数の補助金を並行して申請していますが、締切アラートのおかげで1件も漏らさずに申請できています。",
    amount: "獲得金額 1,200万円",
    stars: 5,
  },
];

const faqs = [
  {
    q: "どんな補助金に対応していますか？",
    a: "経済産業省・中小企業庁・厚労省・農水省・環境省・各都道府県の補助金・助成金に対応しています。IT導入補助金、ものづくり補助金、小規模事業者持続化補助金、事業再構築補助金など主要127件以上を収録しています。",
  },
  {
    q: "専門知識がなくても使えますか？",
    a: "はい、補助金の知識がなくても大丈夫です。事業内容を日本語で入力するだけでAIが最適な補助金を推奨します。申請書類もテンプレートが用意されているので、初めての方でもスムーズに申請できます。",
  },
  {
    q: "無料プランでどこまで使えますか？",
    a: "無料プランでは月10回の補助金検索、月3回のAIマッチング、5件のテンプレートダウンロードが利用できます。まずは無料でお試しいただき、必要に応じてアップグレードしてください。",
  },
  {
    q: "採択の保証はありますか？",
    a: "採択の保証はしておりませんが、過去の採択データを活用した最適化により、ユーザーの採択率は平均62%（業界平均比+24%）を達成しています。",
  },
  {
    q: "データのセキュリティは大丈夫ですか？",
    a: "銀行レベルのAES-256暗号化を採用し、SOC 2 Type II 準拠のセキュリティ体制を整えています。事業情報は第三者に提供することはありません。",
  },
];

const plans = [
  {
    name: "スターター",
    price: "0",
    period: "永久無料",
    desc: "まずは試してみたい方に",
    features: [
      "補助金検索（月10回）",
      "AIマッチング（月3回）",
      "テンプレート5件",
      "メールサポート",
    ],
    cta: "無料で始める",
    highlighted: false,
  },
  {
    name: "スタンダード",
    price: "9,800",
    period: "月額（税込）",
    desc: "本格的に活用したい中小企業に",
    features: [
      "補助金検索（無制限）",
      "AIマッチング（無制限）",
      "テンプレート全件",
      "申請管理ツール",
      "締切アラート",
      "チャットサポート",
    ],
    cta: "14日間無料トライアル",
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
      "採択率レポート",
      "カスタム分析",
    ],
    cta: "お問い合わせ",
    highlighted: false,
  },
];

const stats = [
  { value: "127+", label: "登録補助金数", icon: Database },
  { value: "62%", label: "平均採択率", icon: TrendingUp },
  { value: "2,400+", label: "利用企業数", icon: Building2 },
  { value: "¥4.8億", label: "累計獲得支援額", icon: Award },
];

/* ─── コンポーネント ────────────────────────────── */

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1500;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const scrollY = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* ── Navbar ──────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 20
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="font-bold text-lg text-gray-900">補助金ナビAI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              ["機能", "#features"],
              ["使い方", "#howto"],
              ["料金", "#pricing"],
              ["よくある質問", "#faq"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              無料で始める
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-4 space-y-3">
            {["機能", "使い方", "料金", "よくある質問"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="block py-2 text-gray-700 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-semibold mt-2"
            >
              無料で始める
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            AIが最適な補助金を自動推奨
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            補助金獲得を、
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              AIが最速でナビ
            </span>
            する
          </h1>

          <p className="text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            事業内容を入力するだけで、経産省・厚労省・自治体の補助金127件以上から
            <br className="hidden md:block" />
            御社に最適な補助金をAIが瞬時に発見。申請管理まで一括サポート。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              無料でAIマッチングを試す
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              機能を見る
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-blue-300 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              クレジットカード不要
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              14日間無料トライアル
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              2,400社以上が利用中
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-blue-300" />
        </div>
      </section>

      {/* ── Stats ───────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const numMatch = stat.value.match(/[\d.]+/);
              const num = numMatch ? parseFloat(numMatch[0]) : 0;
              const suffix = stat.value.replace(/[\d.]+/, "");
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">
                    <CountUp target={num} suffix={suffix} />
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase">Features</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              補助金獲得に必要な機能が
              <br />
              すべて揃っています
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              AIマッチングから申請管理・テンプレートまで、補助金申請のフローをEnd-to-Endでサポートします
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
                >
                  <div
                    className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div
                      className={`w-6 h-6 bg-gradient-to-br ${f.color} rounded`}
                      style={{ WebkitMask: "none" }}
                    >
                      <Icon className="w-6 h-6 text-white" style={{ display: "none" }} />
                    </div>
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${f.color} bg-clip-text`} style={{ color: "transparent", backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.desc}</p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    試してみる <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────── */}
      <section id="howto" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase">How it works</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              たった3ステップで
              <br />
              補助金申請がスタート
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="text-center relative">
                    <div className="relative inline-block mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-black text-blue-900">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:-translate-y-0.5"
            >
              今すぐ無料で始める <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-950 to-indigo-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-yellow-400 tracking-widest uppercase">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-white mt-2 mb-4">
              導入企業の声
            </h2>
            <p className="text-blue-300">全国2,400社以上の中小企業にご利用いただいています</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-blue-300 text-xs">{t.title}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-yellow-400 text-sm font-semibold">
                    <Award className="w-4 h-4" />
                    {t.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────── */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase">Pricing</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              シンプルな料金プラン
            </h2>
            <p className="text-gray-500">まずは無料から。いつでもアップグレード・解約できます。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 relative ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl shadow-blue-200"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 text-xs font-black px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <h3
                  className={`font-bold text-lg mb-1 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className={`text-xs mb-4 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ¥{plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        className={`w-4 h-4 flex-shrink-0 ${
                          plan.highlighted ? "text-yellow-400" : "text-green-500"
                        }`}
                      />
                      <span className={plan.highlighted ? "text-blue-100" : "text-gray-600"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-lg"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase">FAQ</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
              よくある質問
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            今すぐ補助金獲得を
            <br />
            スタートしましょう
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            無料で始められます。クレジットカード不要。
            <br />
            2,400社以上が補助金ナビAIで補助金を獲得しています。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-xl hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5" />
              無料でAIマッチングを試す
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-10 py-4 rounded-xl border border-white/30 transition-all duration-200"
            >
              料金プランを見る
            </a>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-blue-300 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              2,400社以上が利用中
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              最短3分でマッチング
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              銀行レベルのセキュリティ
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="font-bold text-white">補助金ナビAI</span>
              </div>
              <p className="text-sm leading-relaxed">
                中小企業の補助金獲得を
                <br />
                AIの力でサポートします。
              </p>
            </div>
            {[
              {
                title: "プロダクト",
                links: ["AIマッチング", "補助金DB", "申請管理", "テンプレート", "分析"],
              },
              {
                title: "サポート",
                links: ["ヘルプセンター", "お問い合わせ", "利用ガイド", "動画チュートリアル"],
              },
              {
                title: "会社情報",
                links: ["会社概要", "利用規約", "プライバシーポリシー", "特定商取引法"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="/dashboard" className="text-sm hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2024 補助金ナビAI. All rights reserved.</p>
            <p className="text-sm">中小企業の未来を、AIと補助金でサポート</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
