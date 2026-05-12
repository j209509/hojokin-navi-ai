"use client";
/*
 * StatsSection.tsx — 実績数値インパクトセクション
 * カウントアップアニメーション + ダーク背景
 */

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 48, suffix: "億円+", label: "累計補助金獲得サポート額", sublabel: "ユーザーが申請・採択した総額" },
  { value: 2891, suffix: "件", label: "登録補助金数", sublabel: "全国リアルタイム更新中" },
  { value: 62, suffix: "%", label: "ユーザー平均採択率", sublabel: "業界平均比 +24ポイント" },
  { value: 2400, suffix: "社+", label: "導入企業数", sublabel: "中小企業・個人事業主" },
];

function CountUp({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="text-5xl sm:text-6xl font-extrabold text-white tabular-nums">
      {val.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-gray-950 py-20 sm:py-28 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">実績・信頼性</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            数字が証明する、<span className="text-yellow-400">圧倒的な実績</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {STATS.map((s, i) => (
            <div key={i} className="bg-gray-900 p-8 sm:p-10 flex flex-col items-center text-center">
              <CountUp target={s.value} suffix={s.suffix} />
              <p className="text-white font-bold mt-3 text-base">{s.label}</p>
              <p className="text-gray-400 text-xs mt-1">{s.sublabel}</p>
            </div>
          ))}
        </div>

        {/* ボトムメッセージ */}
        <p className="text-center text-gray-500 text-sm mt-8">
          ※ 数値は2026年5月時点。採択率は当社ユーザーの実績値であり、個別の結果を保証するものではありません。
        </p>
      </div>
    </section>
  );
}
