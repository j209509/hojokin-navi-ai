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
  BookmarkPlus, ArrowRight, Brain, Info
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

const loadingSteps = [
  "事業内容を解析中...",
  "補助金データベースを検索中...",
  "AIが適合度を計算中...",
  "推奨リストを生成中...",
];

function scoreColor(score: number) {
  if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 55) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-gray-600 bg-gray-50 border-gray-200";
}

function rankGradient(rank: number) {
  return [
    "from-yellow-400 to-orange-500",
    "from-slate-400 to-slate-600",
    "from-amber-600 to-amber-800",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
  ][rank - 1] ?? "from-gray-400 to-gray-600";
}

export default function AIMatching() {
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"claude" | "mock" | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

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
        body: JSON.stringify({ businessDesc, industry, employeeCount }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(d.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { results: MatchResult[]; source: "claude" | "mock" };
      setResults(data.results);
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
    } catch { /* ログイン不要でもローカル状態は更新 */ }
    setBookmarked((prev) => {
      const next = new Set(prev);
      isMarked ? next.delete(grantId) : next.add(grantId);
      return next;
    });
  };

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

          <div className="grid grid-cols-2 gap-4">
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

      {/* 結果一覧 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              <span className="text-blue-600">{results.length}件</span>の補助金が見つかりました
            </h2>
            <div className="flex items-center gap-2">
              {aiSource === "claude" && (
                <Badge className="bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Brain className="w-3 h-3" />Claude AI分析済み
                </Badge>
              )}
              {aiSource === "mock" && (
                <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />デモデータ
                </Badge>
              )}
            </div>
          </div>

          {results.map((result, i) => (
            <Card key={result.grantId} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${rankGradient(i + 1)}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rankGradient(i + 1)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{result.name}</h3>
                        <Badge variant="outline" className="text-xs">{result.ministry}</Badge>
                        <Badge className="text-xs bg-gray-100 text-gray-600">{result.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{result.description}</p>
                      {result.matchReason && (
                        <div className="mt-2 p-2 bg-purple-50 border border-purple-100 rounded-lg">
                          <p className="text-xs text-purple-700 flex items-start gap-1.5">
                            <Brain className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>{result.matchReason}</span>
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {result.requirements.slice(0, 3).map((req, j) => (
                          <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">✓ {req}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right space-y-2 min-w-[140px]">
                    <div className={`border rounded-lg p-2 text-center ${scoreColor(result.matchScore)}`}>
                      <p className="text-xs font-medium">マッチ度</p>
                      <p className="text-2xl font-bold">{result.matchScore}%</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">最大{result.maxAmount.toLocaleString()}万円</p>
                    <div className="flex items-center gap-1 justify-end text-gray-500 text-xs">
                      <Clock className="w-3 h-3" /><span>{result.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">採択率 {result.adoptionRate}%</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleBookmark(result.grantId)}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                        <BookmarkPlus className={`w-4 h-4 ${bookmarked.has(result.grantId) ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} />
                      </button>
                      <Button size="sm" className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700">
                        申請開始 <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
