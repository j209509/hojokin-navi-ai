"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, Clock, TrendingUp, Loader2,
  BookmarkPlus, ArrowRight, Brain, Info,
  CheckCircle2, CalendarDays, Banknote, ListChecks,
  Zap,
} from "lucide-react";
import { ApiError, CardSkeleton } from "@/components/ErrorBoundary";

type MatchResult = {
  grantId: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  maxAmount: number;
  adoptionRate: number;
  deadline: string;
  tags: string[];
  matchScore: number;
  matchReason: string;
  requirements: string[];
};

const industries = [
  "製造業", "小売業", "飲食業", "IT・通信業", "建設業",
  "サービス業", "医療・福祉", "不動産業", "農業・林業", "運輸業", "その他",
];
const employeeCounts = [
  "1〜5名", "6〜10名", "11〜20名", "21〜50名",
  "51〜100名", "101〜300名", "301名以上",
];
const prefectures = [
  "指定なし（全国の補助金のみ）",
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

// カテゴリ別 金額レンジ（maxAmount=0のとき表示）
const AMOUNT_RANGE_MAP: Record<string, string> = {
  "デジタル化":   "50〜1,500万円",
  "設備投資":     "100〜5,000万円",
  "人材育成":     "30〜200万円",
  "販路開拓":     "50〜200万円",
  "省エネ":       "100〜3,000万円",
  "事業転換":     "500〜7,000万円",
  "雇用":         "30〜300万円",
  "農業":         "100〜2,000万円",
  "創業":         "50〜300万円",
  "海外展開":     "100〜500万円",
  "技術開発":     "100〜1,000万円",
  "地域活性化":   "100〜5,000万円",
};

const loadingSteps = [
  "事業内容を解析中...",
  "補助金データベースを検索中...",
  "AIが適合度を計算中...",
  "推奨リストを生成中...",
];

// カテゴリ別 申請期間目安
const PERIOD_MAP: Record<string, string> = {
  "デジタル化":   "約2〜4ヶ月",
  "設備投資":     "約3〜6ヶ月",
  "人材育成":     "約1〜3ヶ月",
  "販路開拓":     "約2〜4ヶ月",
  "省エネ":       "約3〜5ヶ月",
  "事業転換":     "約4〜8ヶ月",
  "雇用":         "約1〜2ヶ月",
  "農業":         "約3〜6ヶ月",
  "創業":         "約2〜4ヶ月",
  "海外展開":     "約3〜6ヶ月",
};

// カテゴリ別 費用目安
const COST_MAP: Record<string, string> = {
  "デジタル化":   "申請書類作成：無料〜数万円（認定支援機関利用時）",
  "設備投資":     "事業計画策定費：5〜30万円程度（認定支援機関必須）",
  "人材育成":     "訓練計画届出：無料（ハローワーク経由）",
  "販路開拓":     "商工会議所への相談：無料〜数万円",
  "省エネ":       "省エネ診断費：無料〜10万円程度",
  "事業転換":     "認定支援機関費：10〜50万円程度",
  "雇用":         "申請手数料：基本無料",
  "農業":         "農業委員会への相談：無料",
  "創業":         "事業計画書作成：無料〜10万円程度",
  "海外展開":     "JETRO相談：無料〜",
};

// カテゴリ別 申請ステップ
const STEPS_MAP: Record<string, string[]> = {
  "デジタル化":   ["GビズIDを取得", "IT導入支援事業者を選定", "ツール・サービスを決定", "申請ポータルで申請", "交付決定後に発注・導入"],
  "設備投資":     ["認定支援機関に相談", "事業計画書を作成", "電子申請で提出", "採択通知を受領", "設備を発注・導入"],
  "人材育成":     ["訓練計画をハローワークへ届出", "訓練を実施", "実績報告書を提出", "助成金を受給"],
  "販路開拓":     ["商工会議所・商工会に相談", "経営計画書を作成", "申請書類を提出", "採択後に事業を実施", "実績報告"],
  "省エネ":       ["省エネ診断を受診", "設備・工事業者を選定", "補助金申請書を提出", "採択後に工事実施", "完了報告"],
  "事業転換":     ["認定支援機関と事業計画策定", "公募期間中に電子申請", "採択後に事業実施", "中間・最終報告"],
  "雇用":         ["ハローワーク等で求人登録", "対象者を雇用", "ハローワークへ申請書提出", "審査後に助成金受給"],
  "農業":         ["農業委員会・JAに相談", "経営計画書を作成", "申請書を提出", "採択後に設備導入"],
  "創業":         ["創業計画書を作成", "創業支援機関に相談", "申請書を提出", "採択後に事業開始", "実績報告"],
  "海外展開":     ["JETRO・商社に相談", "海外展開計画を策定", "申請書を提出", "採択後に展開活動実施"],
};

// 金額表示：maxAmount > 0 → 実値、0 → 説明文抽出 or カテゴリ別レンジ
function resolveAmount(maxAmount: number, category: string, description: string): {
  text: string;
  isReal: boolean;
  isRange: boolean;
} {
  if (maxAmount > 0) {
    return { text: `${maxAmount.toLocaleString()}万円`, isReal: true, isRange: false };
  }
  // 説明文から「〇〇万円」「〇〇億円」を抽出
  const m = description.match(/(?:上限|最大|〜)[約]?\s*([0-9,]+)\s*万円/);
  if (m) {
    const v = parseInt(m[1].replace(/,/g, ""), 10);
    if (v > 0) return { text: `〜${v.toLocaleString()}万円`, isReal: false, isRange: false };
  }
  const m2 = description.match(/([0-9,]+)\s*億円/);
  if (m2) {
    const v = parseInt(m2[1].replace(/,/g, ""), 10) * 10000;
    return { text: `〜${v.toLocaleString()}万円`, isReal: false, isRange: false };
  }
  // カテゴリ別目安レンジ
  const range = AMOUNT_RANGE_MAP[category];
  if (range) return { text: range, isReal: false, isRange: true };
  return { text: "数十〜数百万円", isReal: false, isRange: true };
}

function getPeriod(category: string) {
  return PERIOD_MAP[category] ?? "約2〜6ヶ月";
}
function getCost(category: string) {
  return COST_MAP[category] ?? "認定支援機関への相談：無料〜数万円程度";
}
function getSteps(category: string, requirements: string[]) {
  const cat = STEPS_MAP[category];
  if (cat) return cat;
  // requirementsから生成
  return requirements.length > 0
    ? [...requirements.slice(0, 3), "申請書類を提出", "採択後に事業実施"]
    : ["認定支援機関に相談", "事業計画書を作成", "電子申請で提出", "採択後に実施"];
}

function scoreColor(score: number): { border: string; text: string; bg: string; glow: string } {
  if (score >= 85) return { border: "border-green-400", text: "text-green-600", bg: "bg-green-50", glow: "shadow-green-100" };
  if (score >= 70) return { border: "border-blue-400",  text: "text-blue-600",  bg: "bg-blue-50",  glow: "shadow-blue-100" };
  if (score >= 55) return { border: "border-yellow-400", text: "text-yellow-600", bg: "bg-yellow-50", glow: "shadow-yellow-100" };
  return { border: "border-gray-300", text: "text-gray-600", bg: "bg-gray-50", glow: "" };
}

function rankConfig(rank: number) {
  return [
    { gradient: "from-yellow-400 to-orange-500", accent: "border-l-yellow-400",  emoji: "🥇", label: "最有力" },
    { gradient: "from-slate-400 to-slate-500",   accent: "border-l-slate-400",   emoji: "🥈", label: "準有力" },
    { gradient: "from-amber-600 to-amber-700",   accent: "border-l-amber-600",   emoji: "🥉", label: "候補"   },
    { gradient: "from-blue-400 to-blue-600",     accent: "border-l-blue-400",    emoji: "4", label: "候補"   },
    { gradient: "from-purple-400 to-purple-600", accent: "border-l-purple-400",  emoji: "5", label: "候補"   },
  ][rank - 1] ?? { gradient: "from-gray-400 to-gray-600", accent: "border-l-gray-400", emoji: String(rank), label: "" };
}

export default function AIMatching() {
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [region, setRegion] = useState("指定なし（全国の補助金のみ）");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"claude" | "mock" | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handleMatch = async () => {
    if (!businessDesc || !industry) return;
    setIsLoading(true);
    setResults([]);
    setError(null);
    setLoadingStep(0);

    for (let i = 0; i < loadingSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setLoadingStep(i + 1);
    }

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessDesc, industry, employeeCount, region }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(d.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { results: MatchResult[]; source: "claude" | "mock" };
      // 金額降順 → 同額はマッチ度降順（金額0は末尾）
      const sorted = [...data.results].sort((a, b) => {
        const aAmt = a.maxAmount > 0 ? a.maxAmount : -1;
        const bAmt = b.maxAmount > 0 ? b.maxAmount : -1;
        if (bAmt !== aAmt) return bAmt - aAmt;
        return b.matchScore - a.matchScore;
      });
      setResults(sorted);
      setAiSource(data.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : "マッチングに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (grantId: string) => {
    const isMarked = bookmarked.has(grantId);
    try {
      await fetch("/api/bookmark", {
        method: isMarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grantId }),
      });
    } catch { /* ignore */ }
    setBookmarked((prev) => {
      const next = new Set(prev);
      isMarked ? next.delete(grantId) : next.add(grantId);
      return next;
    });
  };

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // 合計受給可能額（実値のみ集計）
  const totalPotential = results.reduce((s, r) => s + (r.maxAmount > 0 ? r.maxAmount : 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AIマッチング</h1>
        <p className="text-gray-500 text-sm mt-1">事業内容を入力するだけで、最適な補助金をAIが自動推奨します</p>
      </div>

      {/* 入力フォーム */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            事業情報を入力してください
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              事業内容・課題 <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="例：ECサイトを運営しており、在庫管理システムの老朽化と受注処理の非効率が課題です。AIを活用した自動化システムの導入を検討しています。"
              className="h-28 resize-none"
              value={businessDesc}
              onChange={(e) => setBusinessDesc(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              {businessDesc.length}/500文字（詳細に書くほどマッチング精度が上がります）
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                業種 <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={(v: string | null) => setIndustry(v ?? "")}>
                <SelectTrigger><SelectValue placeholder="業種を選択" /></SelectTrigger>
                <SelectContent>
                  {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">従業員数</label>
              <Select onValueChange={(v: string | null) => setEmployeeCount(v ?? "")}>
                <SelectTrigger><SelectValue placeholder="従業員数を選択" /></SelectTrigger>
                <SelectContent>
                  {employeeCounts.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                都道府県
                <span className="ml-1 text-xs text-gray-400 font-normal">（地域補助金を含む場合）</span>
              </label>
              <Select value={region} onValueChange={(v: string | null) => setRegion(v ?? "指定なし（全国の補助金のみ）")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {prefectures.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleMatch}
            disabled={isLoading || !businessDesc || !industry}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{loadingSteps[loadingStep - 1] ?? "処理中..."}</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />AIマッチングを開始</>
            )}
          </Button>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={(loadingStep / loadingSteps.length) * 100} className="h-2" />
              <div className="flex justify-between">
                {loadingSteps.map((_, i) => (
                  <span key={i} className={`text-xs ${i < loadingStep ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                    {i < loadingStep ? "✓" : "○"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <ApiError message={error} onRetry={handleMatch} />}
      {isLoading && loadingStep >= 3 && <CardSkeleton count={3} />}

      {/* ─── 結果 ─── */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* サマリーバナー */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">AIが厳選した補助金</p>
                <p className="text-3xl font-extrabold mt-0.5">
                  {results.length}件 見つかりました
                </p>
                {aiSource === "claude" && (
                  <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                    <Brain className="w-3 h-3" /> Claude AIによる本格分析
                  </p>
                )}
                {aiSource === "mock" && (
                  <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> キーワードマッチング（デモ）
                  </p>
                )}
              </div>
              {totalPotential > 0 && (
                <div className="bg-white/15 rounded-xl px-5 py-3 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-xs font-medium">合計受給可能額（上限合計）</p>
                  <p className="text-4xl font-extrabold text-yellow-300 mt-0.5">
                    {totalPotential.toLocaleString()}<span className="text-2xl ml-1">万円</span>
                  </p>
                  <p className="text-blue-200 text-xs mt-0.5">※各補助金の上限額の合計</p>
                </div>
              )}
            </div>
          </div>

          {/* 個別カード */}
          {results.map((result, i) => {
            const rc = rankConfig(i + 1);
            const sc = scoreColor(result.matchScore);
            const isExpanded = expanded.has(result.grantId);
            const steps = getSteps(result.category, result.requirements);
            const amt = resolveAmount(result.maxAmount, result.category, result.description);

            return (
              <Card
                key={result.grantId}
                className={`border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 ${rc.accent}`}
              >
                <CardContent className="p-0">
                  {/* ── 上部：タイトル＋金額＋スコア ── */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start gap-4">
                      {/* ランクバッジ */}
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                        {i < 3 ? rc.emoji : i + 1}
                      </div>

                      {/* 名前・省庁・カテゴリ */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-base leading-tight">{result.name}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">{result.ministry}</Badge>
                          <Badge className="text-xs bg-gray-100 text-gray-600 border-0">{result.category}</Badge>
                          {rc.label && i < 3 && (
                            <Badge className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
                              <Zap className="w-2.5 h-2.5 mr-0.5" />{rc.label}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* マッチ度スコア */}
                      <div className={`border-2 ${sc.border} ${sc.bg} rounded-xl px-3 py-2 text-center flex-shrink-0 shadow-sm ${sc.glow}`}>
                        <p className={`text-xs font-semibold ${sc.text}`}>マッチ度</p>
                        <p className={`text-3xl font-extrabold ${sc.text} leading-none mt-0.5`}>{result.matchScore}%</p>
                      </div>
                    </div>

                    {/* ── 最大受給額（ヒーロー表示） ── */}
                    <div className={`mt-4 rounded-xl p-4 ${amt.isReal ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"}`}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5" />
                            {amt.isReal ? "最大受給額" : amt.isRange ? "受給額の目安" : "上限額（目安）"}
                          </p>
                          <p className={`text-4xl font-extrabold mt-0.5 leading-none ${amt.isReal ? "text-green-600" : "text-blue-600"}`}>
                            {amt.text.replace("万円", "")}<span className={`text-2xl ml-1 ${amt.isReal ? "text-green-500" : "text-blue-500"}`}>万円</span>
                          </p>
                          {!amt.isReal && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {amt.isRange ? "同カテゴリの一般的な範囲。公募要領で確認を" : "説明文より推定。公募要領で正確な金額を確認を"}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-gray-400">採択率</p>
                            <p className="font-bold text-blue-600 flex items-center gap-0.5">
                              <TrendingUp className="w-3.5 h-3.5" />{result.adoptionRate}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">締切</p>
                            <p className="font-bold text-gray-700 flex items-center gap-0.5 text-xs">
                              <CalendarDays className="w-3.5 h-3.5" />{result.deadline}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">採択まで</p>
                            <p className="font-bold text-purple-600 flex items-center gap-0.5 text-xs">
                              <Clock className="w-3.5 h-3.5" />{getPeriod(result.category)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI分析コメント */}
                    {result.matchReason && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                        <p className="text-xs text-purple-700 flex items-start gap-1.5">
                          <Brain className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">AIが選んだ理由：</span>
                          <span>{result.matchReason}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── 詳細（展開式） ── */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => toggleExpand(result.grantId)}
                      className="w-full px-5 py-2.5 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <ListChecks className="w-4 h-4 text-blue-500" />
                        申請の流れ・費用・条件を見る
                      </span>
                      <span className={`text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-4 space-y-4 bg-gray-50/50">
                        {/* 申請ステップ */}
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />受給までの流れ
                          </p>
                          <div className="flex flex-wrap items-center gap-1">
                            {steps.map((step, j) => (
                              <div key={j} className="flex items-center gap-1">
                                <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 shadow-sm">
                                  <span className="text-blue-500 font-bold mr-1">{j + 1}.</span>{step}
                                </span>
                                {j < steps.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 期間・費用 */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mb-1">
                              <Clock className="w-3.5 h-3.5 text-purple-500" />申請〜採択まで
                            </p>
                            <p className="text-sm font-semibold text-purple-700">{getPeriod(result.category)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">採択後の事業実施期間は別途</p>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mb-1">
                              <Banknote className="w-3.5 h-3.5 text-orange-500" />申請にかかる費用
                            </p>
                            <p className="text-xs font-medium text-orange-700 leading-relaxed">{getCost(result.category)}</p>
                          </div>
                        </div>

                        {/* 申請条件 */}
                        {result.requirements.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />主な申請条件
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {result.requirements.map((req, j) => (
                                <span key={j} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
                                  ✓ {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── アクションボタン ── */}
                  <div className="px-5 py-3 flex items-center justify-between gap-3 bg-white border-t border-gray-100">
                    <button
                      onClick={() => handleBookmark(result.grantId)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        bookmarked.has(result.grantId)
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <BookmarkPlus className={`w-3.5 h-3.5 ${bookmarked.has(result.grantId) ? "fill-blue-500" : ""}`} />
                      {bookmarked.has(result.grantId) ? "保存済み" : "保存"}
                    </button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5"
                    >
                      この補助金に申請する <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
