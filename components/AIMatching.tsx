"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Clock, TrendingUp, Loader2, BookmarkPlus, ArrowRight } from "lucide-react";

const subsidyResults = [
  {
    rank: 1,
    name: "IT導入補助金2024",
    ministry: "経済産業省",
    matchScore: 96,
    maxAmount: "最大450万円",
    deadline: "2024年5月31日",
    adoptionRate: 68,
    category: "デジタル化",
    description: "中小企業・小規模事業者のITツール導入を支援。業務効率化・売上向上を実現するソフトウェア、クラウドサービス等の経費を補助します。",
    requirements: ["中小企業・小規模事業者", "IT導入支援事業者との連携", "生産性向上への活用"],
    color: "from-blue-500 to-blue-600",
  },
  {
    rank: 2,
    name: "小規模事業者持続化補助金",
    ministry: "中小企業庁",
    matchScore: 89,
    maxAmount: "最大200万円",
    deadline: "2024年6月12日",
    adoptionRate: 54,
    category: "販路開拓",
    description: "小規模事業者の販路開拓・業務効率化を支援。チラシ作成、HP制作、展示会出展、設備導入等の経費の2/3を補助します。",
    requirements: ["小規模事業者（従業員20名以下）", "商工会議所・商工会の会員", "事業計画の策定"],
    color: "from-green-500 to-green-600",
  },
  {
    rank: 3,
    name: "ものづくり補助金",
    ministry: "中小企業庁",
    matchScore: 82,
    maxAmount: "最大1,000万円",
    deadline: "2024年6月7日",
    adoptionRate: 48,
    category: "設備投資",
    description: "革新的な製品・サービス開発や生産プロセス改善のための設備投資を支援。機械装置、システム構築費等の経費を補助します。",
    requirements: ["中小企業・小規模事業者", "革新的な取り組みの実施", "給与支給総額の増加"],
    color: "from-purple-500 to-purple-600",
  },
  {
    rank: 4,
    name: "事業再構築補助金",
    ministry: "経済産業省",
    matchScore: 74,
    maxAmount: "最大1億円",
    deadline: "2024年7月31日",
    adoptionRate: 38,
    category: "事業転換",
    description: "新分野展開、業態転換、事業・業種転換等の思い切った事業再構築に取り組む中小企業を支援します。",
    requirements: ["売上減少要件（2020年4月以降）", "認定経営革新等支援機関との連携", "付加価値額の増加"],
    color: "from-orange-500 to-orange-600",
  },
  {
    rank: 5,
    name: "省エネ設備導入補助金",
    ministry: "環境省",
    matchScore: 67,
    maxAmount: "最大3,000万円",
    deadline: "2024年8月30日",
    adoptionRate: 62,
    category: "省エネ",
    description: "省エネルギー設備の導入を通じてCO2排出量削減と事業コスト削減を同時に実現する取り組みを支援します。",
    requirements: ["設備導入による省エネ効果", "中小企業・団体等", "SII登録製品の使用"],
    color: "from-teal-500 to-teal-600",
  },
];

const industries = ["製造業", "小売業", "飲食業", "IT・通信業", "建設業", "サービス業", "医療・福祉", "不動産業", "農業・林業", "運輸業", "その他"];
const employeeCounts = ["1〜5名", "6〜10名", "11〜20名", "21〜50名", "51〜100名", "101〜300名", "301名以上"];

export default function AIMatching() {
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "事業内容を解析中...",
    "補助金データベースを検索中...",
    "適合度スコアを計算中...",
    "推奨リストを生成中...",
  ];

  const handleMatch = async () => {
    setIsLoading(true);
    setShowResults(false);
    setLoadingStep(0);
    for (let i = 0; i < loadingSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setLoadingStep(i + 1);
    }
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);
    setShowResults(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AIマッチング</h1>
        <p className="text-gray-500 text-sm mt-1">事業内容を入力するだけで、最適な補助金をAIが自動推奨します</p>
      </div>

      {/* Input Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            事業情報を入力してください
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">事業内容・課題 <span className="text-red-500">*</span></label>
            <Textarea
              placeholder="例：ECサイトを運営しており、在庫管理システムの老朽化と受注処理の非効率が課題です。AIを活用した自動化システムの導入を検討しています。"
              className="h-28 resize-none"
              value={businessDesc}
              onChange={(e) => setBusinessDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">業種 <span className="text-red-500">*</span></label>
              <Select onValueChange={(v: string | null) => { if (v) setIndustry(v); }}>
                <SelectTrigger>
                  <SelectValue placeholder="業種を選択" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">従業員数</label>
              <Select onValueChange={(v: string | null) => { if (v) setEmployeeCount(v); }}>
                <SelectTrigger>
                  <SelectValue placeholder="従業員数を選択" />
                </SelectTrigger>
                <SelectContent>
                  {employeeCounts.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleMatch}
            disabled={isLoading || !businessDesc || !industry}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{loadingSteps[loadingStep - 1] || "処理中..."}</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />AIマッチングを開始</>
            )}
          </Button>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={(loadingStep / loadingSteps.length) * 100} className="h-2" />
              <div className="flex justify-between">
                {loadingSteps.map((step, i) => (
                  <span key={i} className={`text-xs ${i < loadingStep ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                    {i < loadingStep ? "✓" : "○"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              <span className="text-blue-600">5件</span>の補助金が見つかりました
            </h2>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200">マッチング完了</Badge>
          </div>
          {subsidyResults.map((subsidy, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${subsidy.color}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subsidy.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {subsidy.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{subsidy.name}</h3>
                        <Badge variant="outline" className="text-xs">{subsidy.ministry}</Badge>
                        <Badge className="text-xs bg-gray-100 text-gray-600">{subsidy.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{subsidy.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {subsidy.requirements.map((req, j) => (
                          <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">✓ {req}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right space-y-2 min-w-[140px]">
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-2 text-center">
                      <p className="text-xs text-yellow-700">マッチ度</p>
                      <p className="text-2xl font-bold text-yellow-600">{subsidy.matchScore}%</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{subsidy.maxAmount}</p>
                    <div className="flex items-center gap-1 justify-end text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{subsidy.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">採択率 {subsidy.adoptionRate}%</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                        <BookmarkPlus className="w-4 h-4 text-gray-500" />
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
