"use client";
/*
 * HeroSection.tsx — フルスクリーン・インパクト最大化ヒーロー
 * - 大型金額アニメーション
 * - AIマッチングデモUI（右側）
 * - 信頼シグナル（ファーストビュー内）
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle, Zap, TrendingUp, Shield, Users } from "lucide-react";

/* ─── アニメーション設定 ─── */
type Step = "idle" | "typing" | "analyzing" | "results";

const TYPING_TEXT = "ECサイト運営・在庫管理システムの老朽化が課題。DX化・自動化を検討中。従業員12名の小売業。";
const TYPING_MS = 45;

const RESULTS = [
  { name: "IT導入補助金2025", amount: "450万円", score: 94, category: "デジタル化", tag: "🥇 最有力", tagColor: "bg-yellow-100 text-yellow-800", barColor: "bg-yellow-400", border: "border-yellow-300" },
  { name: "小規模事業者持続化補助金", amount: "200万円", score: 87, category: "販路開拓", tag: "🥈 準有力", tagColor: "bg-slate-100 text-slate-700", barColor: "bg-blue-500", border: "border-blue-200" },
  { name: "ものづくり補助金", amount: "1,250万円", score: 81, category: "設備投資", tag: "🥉 候補", tagColor: "bg-orange-100 text-orange-700", barColor: "bg-purple-500", border: "border-purple-200" },
];

/* ─── カウントアップ ─── */
function useCount(target: number, duration: number, start: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

export default function HeroSection() {
  const [step, setStep] = useState<Step>("idle");
  const [typed, setTyped] = useState("");
  const [visibleResults, setVisibleResults] = useState(0);
  const [totalVisible, setTotalVisible] = useState(false);

  const total = useCount(1900, 1200, totalVisible);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const run = async () => {
      // idle
      setStep("idle");
      setTyped("");
      setVisibleResults(0);
      setTotalVisible(false);
      await delay(1200);

      // typing
      setStep("typing");
      for (let i = 0; i <= TYPING_TEXT.length; i++) {
        setTyped(TYPING_TEXT.slice(0, i));
        await delay(TYPING_MS);
      }
      await delay(500);

      // analyzing
      setStep("analyzing");
      await delay(2200);

      // results appear one by one
      setStep("results");
      for (let i = 1; i <= RESULTS.length; i++) {
        setVisibleResults(i);
        await delay(450);
      }
      await delay(300);
      setTotalVisible(true);

      // hold then restart
      await delay(5000);
      t = setTimeout(run, 0);
    };

    t = setTimeout(run, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 overflow-hidden flex flex-col">
      {/* ── 背景装飾 ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)" }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        {/* グリッド */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── メインコンテンツ ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* 左：コピー */}
            <div className="text-white">
              {/* バッジ */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-xs font-medium text-blue-100">全国2,891件の補助金をリアルタイム更新</span>
              </div>

              {/* メインヘッドライン */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
                <span className="block text-white">補助金、</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  AIが5秒で
                </span>
                <span className="block text-white">見つけます。</span>
              </h1>

              {/* サブコピー */}
              <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-4 max-w-xl">
                事業内容を入力するだけ。全国2,891件の補助金から、
                <strong className="text-white">御社に最適な補助金をAIが即座に発見</strong>し、
                申請書の下書きまで自動生成します。
              </p>

              {/* キーベネフィット */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                {[
                  "登録30秒・クレジットカード不要",
                  "AIが補助金候補を自動ランキング",
                  "申請書テンプレートを自動生成",
                  "ユーザー平均採択率 62%達成",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-blue-100">{t}</span>
                  </div>
                ))}
              </div>

              {/* CTAボタン */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/auth/signin"
                  className="group inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-lg px-8 py-4 rounded-2xl transition-all duration-200 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:-translate-y-1"
                >
                  <Zap className="w-5 h-5" />
                  無料で補助金を探す
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#howitworks"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-6 py-4 rounded-2xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  使い方を見る
                </a>
              </div>

              {/* 信頼シグナル */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-blue-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>2,400社以上が導入</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>累計補助金獲得額 ¥4.8億超</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>SSL暗号化・安全なデータ保護</span>
                </div>
              </div>
            </div>

            {/* 右：AIデモUI */}
            <div className="relative">
              {/* グロー効果 */}
              <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-2xl" />

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                {/* デモヘッダー */}
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-700 rounded px-3 py-0.5 text-xs text-gray-400 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      hojokin-navi-ai.vercel.app
                    </div>
                  </div>
                </div>

                {/* 入力エリア */}
                <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">事業内容・課題</p>
                  <div className="min-h-[72px] bg-white border-2 border-blue-200 rounded-xl p-3 text-sm text-gray-700 relative">
                    {typed}
                    {step === "typing" && (
                      <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle animate-pulse" />
                    )}
                    {step === "idle" && (
                      <span className="text-gray-400">事業内容・課題を入力してください...</span>
                    )}
                  </div>

                  {/* ボタン */}
                  <div className="mt-3">
                    {(step === "idle" || step === "typing") ? (
                      <div className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                        step === "typing"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-400"
                      }`}>
                        <Sparkles className="w-4 h-4" />
                        AIマッチングを開始
                      </div>
                    ) : step === "analyzing" ? (
                      <div className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center gap-2 text-white text-sm font-semibold shadow-lg">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        AIが2,891件を分析中...
                      </div>
                    ) : (
                      <div className="w-full h-11 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center gap-2 text-white text-sm font-bold shadow-lg">
                        <CheckCircle className="w-4 h-4" />
                        マッチング完了！
                      </div>
                    )}
                  </div>
                </div>

                {/* 結果エリア */}
                <div className="px-4 pb-4 space-y-2.5">
                  {step === "analyzing" && (
                    <div className="space-y-2 py-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  )}

                  {step === "results" && RESULTS.slice(0, visibleResults).map((r, i) => (
                    <div
                      key={r.name}
                      className={`border-2 ${r.border} rounded-xl p-3 transition-all duration-500`}
                      style={{ animation: "fadeSlideUp 0.4s ease-out both", animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.tagColor}`}>{r.tag}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{r.category}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">マッチ度 {r.score}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-800 truncate pr-2">{r.name}</p>
                        <p className="text-lg font-extrabold text-green-600 flex-shrink-0">最大{r.amount}</p>
                      </div>
                      <div className="mt-1.5 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full ${r.barColor} rounded-full transition-all duration-700`}
                          style={{ width: `${r.score}%` }} />
                      </div>
                    </div>
                  ))}

                  {/* 合計バナー */}
                  {totalVisible && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white"
                      style={{ animation: "fadeSlideUp 0.5s ease-out both" }}>
                      <p className="text-xs font-medium text-blue-200 mb-0.5">合計受給可能額（上限）</p>
                      <p className="text-3xl font-extrabold text-yellow-300">
                        {total.toLocaleString()}<span className="text-xl ml-1">万円</span>
                      </p>
                      <p className="text-xs text-blue-200 mt-0.5">※各補助金の上限合計。実際の受給額は審査により異なります</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 下部：マーキー（省庁ロゴ代わりにテキスト） ── */}
      <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm py-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-xs text-blue-300 px-4 sm:px-6 whitespace-nowrap flex-shrink-0">対応省庁・機関</p>
          <div className="w-px h-4 bg-white/20 flex-shrink-0" />
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-8 text-xs text-blue-200 font-medium animate-[marquee_25s_linear_infinite] whitespace-nowrap px-4">
            {["経済産業省", "中小企業庁", "厚生労働省", "農林水産省", "環境省", "国土交通省", "デジタル庁", "総務省", "内閣府", "観光庁", "NEDO", "JST", "JETRO", "中小機構", "各都道府県"].concat(
              ["経済産業省", "中小企業庁", "厚生労働省", "農林水産省", "環境省", "国土交通省", "デジタル庁", "総務省", "内閣府", "観光庁", "NEDO", "JST", "JETRO", "中小機構", "各都道府県"]
            ).map((name, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
