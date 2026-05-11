/*
 * StatsSection.tsx
 * ─────────────────────────────────────────────────────────────
 * 4つの実績数値をカウントアップアニメーション付きで表示
 * IntersectionObserver でビューポート内に入ったタイミングで開始
 * ブランドカラー（blue-900 背景）でインパクトを出す
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Database, Clock, FileText, ThumbsUp } from "lucide-react";

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
}

const STATS: Stat[] = [
  {
    icon: Database,
    value: 2400,
    suffix: "件以上",
    label: "対応補助金数",
    sublabel: "経産省・厚労省・都道府県・市区町村",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border border-yellow-400/20",
  },
  {
    icon: Clock,
    value: 3,
    suffix: "分以内",
    label: "平均マッチング時間",
    sublabel: "従来の自力検索（平均12時間）から97.5%短縮",
    color: "text-green-400",
    bg: "bg-green-400/10 border border-green-400/20",
  },
  {
    icon: FileText,
    value: 68,
    suffix: "%削減",
    label: "申請書作成時間",
    sublabel: "テンプレート活用ベース。作業時間を劇的に圧縮",
    color: "text-blue-300",
    bg: "bg-blue-400/10 border border-blue-400/20",
  },
  {
    icon: ThumbsUp,
    value: 94,
    suffix: "%",
    label: "ユーザー満足度",
    sublabel: "94.2% — アンケートベース（n=312）",
    color: "text-pink-400",
    bg: "bg-pink-400/10 border border-pink-400/20",
  },
];

function AnimatedNumber({
  target,
  suffix,
  prefix = "",
  active,
}: {
  target: number;
  suffix: string;
  prefix?: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    let frame = 0;
    const duration = 1600;
    const totalFrames = Math.ceil(duration / 16);

    const tick = () => {
      frame++;
      // ease-out cubic
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current = Math.round(progress * target);
      setCount(current);
      if (frame < totalFrames) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-blue-950 to-indigo-950 py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-yellow-400 tracking-[0.2em] uppercase">
            Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            数字で見る、補助金ナビAIの効果
          </h2>
          <p className="text-blue-300 mt-3 text-sm">
            実際のユーザーデータと計算に基づく実績数値です
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 ${stat.bg}`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-3xl sm:text-4xl font-extrabold mb-1 ${stat.color}`}>
                  <AnimatedNumber
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    active={active}
                  />
                </p>
                <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
                <p className="text-blue-400 text-xs leading-relaxed">{stat.sublabel}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
