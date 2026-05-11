/*
 * HeroSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 【採用パターン分析】
 * - freee スタイル: 定量訴求（5分・登録30秒）で心理的ハードルを下げる
 * - SmartHR スタイル: ターゲットの「痛み」から入り共感を得てからソリューションへ
 * - マネーフォワード スタイル: 利用者数・実績数値を Hero に埋め込み信頼を先付け
 *
 * 【本質的価値の訴求軸】
 * 「補助金があることは知っているのに自分には難しいと諦めていた事業者が、
 *  5分の入力で自社にピッタリの補助金と申請書の下書きを手に入れる瞬間」
 *
 * Mock UI animation: idle → typing → loading → results → (loop)
 * framer-motion 未使用 → CSS animation + React state machine
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle, ChevronDown, Search, Loader2 } from "lucide-react";

type AnimStep = "typing" | "loading" | "results";

const TYPING_TARGET = "製造業・設備投資・従業員50名";
const TYPING_SPEED_MS = 80;

const MOCK_RESULTS = [
  {
    name: "ものづくり補助金",
    amount: "最大1,250万円",
    rate: "採択率 47%",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
  },
  {
    name: "IT導入補助金",
    amount: "最大450万円",
    rate: "採択率 68%",
    color: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  {
    name: "小規模事業者持続化補助金",
    amount: "最大200万円",
    rate: "採択率 62%",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
  },
];

export default function HeroSection() {
  const [animStep, setAnimStep] = useState<AnimStep>("typing");
  const [typed, setTyped] = useState("");
  const [visibleResults, setVisibleResults] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const runAnimation = () => {
      if (cancelled) return;

      // --- Phase 1: typing ---
      setTyped("");
      setVisibleResults(0);
      setAnimStep("typing");

      let i = 0;
      const typeInterval = setInterval(() => {
        if (cancelled) { clearInterval(typeInterval); return; }
        i++;
        setTyped(TYPING_TARGET.slice(0, i));
        if (i >= TYPING_TARGET.length) {
          clearInterval(typeInterval);

          // --- Phase 2: loading ---
          setTimeout(() => {
            if (cancelled) return;
            setAnimStep("loading");

            // --- Phase 3: results (staggered) ---
            setTimeout(() => {
              if (cancelled) return;
              setAnimStep("results");
              setVisibleResults(1);
              setTimeout(() => { if (!cancelled) setVisibleResults(2); }, 350);
              setTimeout(() => { if (!cancelled) setVisibleResults(3); }, 700);

              // Loop
              setTimeout(() => { if (!cancelled) runAnimation(); }, 5000);
            }, 1400);
          }, 500);
        }
      }, TYPING_SPEED_MS);
    };

    const start = setTimeout(runAnimation, 800);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT: Copy & CTA ── */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
              全国2,400件の補助金をAIが瞬時にスキャン
            </div>

            {/* Target empathy text */}
            <p className="text-blue-300 text-sm mb-4 leading-relaxed">
              行政窓口・社労士への相談・自力検索…それでも補助金を取れずにいる
              <br className="hidden sm:block" />
              中小企業・個人事業主の方へ
            </p>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              補助金、
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                見つけるより
              </span>
              <br />
              使う時代へ。
            </h1>

            {/* Sub copy */}
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              事業内容を入力するだけで、AIが最適な補助金を発見。
              <br className="hidden sm:block" />
              申請書の下書きまで、<strong className="text-white">5分で完了。</strong>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-base px-7 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                無料で補助金を探す（登録30秒）
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                デモを見る
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Safety text */}
            <p className="text-blue-400 text-xs text-center lg:text-left">
              クレジットカード不要 · 無料プランあり · いつでも解約可能
            </p>

            {/* Social proof chips */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-6">
              {[
                { icon: CheckCircle, text: "2,400社以上が利用中" },
                { icon: CheckCircle, text: "平均3分でマッチング" },
                { icon: CheckCircle, text: "採択率+24%向上" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-blue-300 text-xs">
                  <Icon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Mock UI Animation ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Mock header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <span className="text-blue-200 text-xs font-medium ml-2">補助金ナビAI — AIマッチング</span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {/* Search box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">事業内容・条件を入力</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-800 flex-1 min-w-0">
                      {typed}
                      {animStep === "typing" && (
                        <span className="inline-block w-0.5 h-4 bg-blue-600 ml-0.5 animate-pulse align-middle" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Loading state */}
                {animStep === "loading" && (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">AIが全国2,400件をスキャン中…</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full animate-[scan_1.4s_ease-in-out_forwards]" style={{ width: "0%" }} />
                    </div>
                  </div>
                )}

                {/* Results */}
                {animStep === "results" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">
                        <span className="text-blue-600 font-bold">3件</span>の補助金が見つかりました
                      </span>
                      <span className="text-xs text-gray-400">採択率順</span>
                    </div>
                    {MOCK_RESULTS.map((r, i) => (
                      <div
                        key={r.name}
                        className={`border rounded-xl p-3 transition-all duration-500 ${r.color} ${
                          i < visibleResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                        }`}
                        style={{ transitionDelay: `${i * 120}ms` }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
                            <span className="text-xs font-bold leading-tight">{r.name}</span>
                          </div>
                          <span className="text-xs font-semibold whitespace-nowrap">{r.amount}</span>
                        </div>
                        <p className="text-xs ml-4 mt-0.5 opacity-70">{r.rate}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Idle / initial state */}
                {animStep === "typing" && typed.length === 0 && (
                  <div className="py-4 text-center text-sm text-gray-400">
                    事業内容を入力すると補助金が見つかります
                  </div>
                )}

                {/* Action button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
                  AIマッチングを実行する
                </button>
                <p className="text-center text-xs text-gray-400">無料プランで月3回まで利用可能</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-blue-400" />
      </div>

      <style>{`
        @keyframes scan {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
