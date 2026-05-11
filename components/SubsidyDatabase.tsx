"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Heart, ArrowRight, Clock, TrendingUp } from "lucide-react";

const allSubsidies = [
  { id: 1, name: "IT導入補助金2024", ministry: "経産省", maxAmount: 450, deadline: "2024/05/31", adoptionRate: 68, category: "デジタル化", description: "中小企業・小規模事業者のITツール導入を支援します。", tags: ["IT", "業務効率化", "クラウド"], popular: true },
  { id: 2, name: "小規模事業者持続化補助金", ministry: "中小企業庁", maxAmount: 200, deadline: "2024/06/12", adoptionRate: 54, category: "販路開拓", description: "小規模事業者の販路開拓・業務効率化を支援します。", tags: ["販路拡大", "HP制作", "広告"], popular: true },
  { id: 3, name: "ものづくり補助金", ministry: "中小企業庁", maxAmount: 1000, deadline: "2024/06/07", adoptionRate: 48, category: "設備投資", description: "革新的な製品・サービス開発や生産プロセス改善のための設備投資を支援します。", tags: ["設備", "製造", "革新"], popular: true },
  { id: 4, name: "事業再構築補助金", ministry: "経産省", maxAmount: 10000, deadline: "2024/07/31", adoptionRate: 38, category: "事業転換", description: "新分野展開、業態転換等の事業再構築に取り組む中小企業を支援します。", tags: ["事業転換", "新分野"], popular: true },
  { id: 5, name: "省エネ設備導入補助金", ministry: "環境省", maxAmount: 3000, deadline: "2024/08/30", adoptionRate: 62, category: "省エネ", description: "省エネルギー設備の導入によりCO2削減と事業コスト削減を支援します。", tags: ["省エネ", "環境", "設備"], popular: false },
  { id: 6, name: "雇用調整助成金", ministry: "厚労省", maxAmount: 900, deadline: "2024/09/30", adoptionRate: 72, category: "雇用", description: "経済上の理由により事業活動の縮小を余儀なくされた事業主への助成金です。", tags: ["雇用", "助成金", "休業"], popular: false },
  { id: 7, name: "キャリアアップ助成金", ministry: "厚労省", maxAmount: 96, deadline: "通年", adoptionRate: 81, category: "人材育成", description: "非正規雇用労働者の正規雇用転換等を促進する事業主への助成金です。", tags: ["正社員化", "処遇改善", "人材"], popular: false },
  { id: 8, name: "東京都中小企業設備投資補助金", ministry: "東京都", maxAmount: 500, deadline: "2024/07/15", adoptionRate: 55, category: "設備投資", description: "都内中小企業の競争力強化のための設備投資を支援します。", tags: ["東京", "設備", "競争力"], popular: false },
  { id: 9, name: "大阪府ものづくり支援補助金", ministry: "大阪府", maxAmount: 300, deadline: "2024/08/01", adoptionRate: 60, category: "製造", description: "大阪府内の中小製造業の技術力強化を支援します。", tags: ["大阪", "製造業", "技術"], popular: false },
  { id: 10, name: "人材開発支援助成金", ministry: "厚労省", maxAmount: 200, deadline: "通年", adoptionRate: 77, category: "人材育成", description: "職業訓練の実施に対して訓練経費や賃金の一部を助成します。", tags: ["研修", "訓練", "人材育成"], popular: false },
  { id: 11, name: "農業経営基盤強化支援補助金", ministry: "農水省", maxAmount: 1500, deadline: "2024/06/30", adoptionRate: 45, category: "農業", description: "農業経営の基盤強化のための機械・設備導入を支援します。", tags: ["農業", "設備", "スマート農業"], popular: false },
  { id: 12, name: "観光地域づくり補助金", ministry: "観光庁", maxAmount: 800, deadline: "2024/10/31", adoptionRate: 42, category: "観光", description: "観光地域の魅力向上と誘客促進のための取り組みを支援します。", tags: ["観光", "地域", "インバウンド"], popular: false },
];

const ministryTabs = ["すべて", "経産省", "厚労省", "自治体", "その他"];
const categoryOptions = ["すべてのカテゴリ", "デジタル化", "設備投資", "人材育成", "販路開拓", "省エネ", "事業転換", "雇用", "製造", "農業", "観光"];
const amountOptions = ["すべての金額", "〜100万円", "100〜500万円", "500〜1000万円", "1000万円以上"];

type Subsidy = typeof allSubsidies[0];

export default function SubsidyDatabase() {
  const [activeTab, setActiveTab] = useState("すべて");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("すべてのカテゴリ");
  const [amountFilter, setAmountFilter] = useState("すべての金額");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedSubsidy, setSelectedSubsidy] = useState<Subsidy | null>(null);

  const filtered = allSubsidies.filter((s) => {
    const matchTab = activeTab === "すべて" ||
      (activeTab === "経産省" && (s.ministry === "経産省" || s.ministry === "中小企業庁")) ||
      (activeTab === "厚労省" && s.ministry === "厚労省") ||
      (activeTab === "自治体" && (s.ministry.includes("都") || s.ministry.includes("府") || s.ministry.includes("県"))) ||
      (activeTab === "その他" && !["経産省", "中小企業庁", "厚労省"].includes(s.ministry) && !s.ministry.includes("都") && !s.ministry.includes("府"));
    const matchSearch = s.name.includes(search) || s.tags.some((t) => t.includes(search));
    const matchCategory = category === "すべてのカテゴリ" || s.category === category;
    const matchAmount = amountFilter === "すべての金額" ||
      (amountFilter === "〜100万円" && s.maxAmount <= 100) ||
      (amountFilter === "100〜500万円" && s.maxAmount > 100 && s.maxAmount <= 500) ||
      (amountFilter === "500〜1000万円" && s.maxAmount > 500 && s.maxAmount <= 1000) ||
      (amountFilter === "1000万円以上" && s.maxAmount > 1000);
    return matchTab && matchSearch && matchCategory && matchAmount;
  });

  const toggleFav = (id: number) => setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">補助金データベース</h1>
        <p className="text-gray-500 text-sm mt-1">全{allSubsidies.length}件の補助金・助成金を掲載中</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {ministryTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="補助金名・キーワードで検索" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select onValueChange={(v: string | null) => { if (v) setCategory(v); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={(v: string | null) => { if (v) setAmountFilter(v); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="金額帯" />
          </SelectTrigger>
          <SelectContent>
            {amountOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 self-center">{filtered.length}件表示</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((subsidy) => (
          <Card key={subsidy.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedSubsidy(subsidy)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{subsidy.ministry}</Badge>
                    {subsidy.popular && <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200 border">人気</Badge>}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{subsidy.name}</h3>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(subsidy.id); }} className="p-1 rounded hover:bg-red-50 transition-colors">
                  <Heart className={`w-4 h-4 ${favorites.includes(subsidy.id) ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
                </button>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{subsidy.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {subsidy.tags.map((tag) => <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>)}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  <p className="text-base font-bold text-blue-700">最大{subsidy.maxAmount.toLocaleString()}万円</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{subsidy.deadline}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-500" />採択率{subsidy.adoptionRate}%</span>
                  </div>
                </div>
                <Button size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                  申請開始 <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedSubsidy} onOpenChange={() => setSelectedSubsidy(null)}>
        <DialogContent className="max-w-lg">
          {selectedSubsidy && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{selectedSubsidy.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedSubsidy.ministry}</Badge>
                  <Badge className="bg-gray-100 text-gray-700">{selectedSubsidy.category}</Badge>
                </div>
                <p className="text-gray-600 text-sm">{selectedSubsidy.description}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "最大補助額", value: `${selectedSubsidy.maxAmount.toLocaleString()}万円`, color: "text-blue-700" },
                    { label: "申請締切", value: selectedSubsidy.deadline, color: "text-orange-600" },
                    { label: "採択率", value: `${selectedSubsidy.adoptionRate}%`, color: "text-green-600" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className={`font-bold ${item.color} mt-1`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubsidy.tags.map((tag) => <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{tag}</span>)}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => toggleFav(selectedSubsidy.id)}>
                    <Heart className={`w-4 h-4 mr-2 ${favorites.includes(selectedSubsidy.id) ? "fill-red-500 text-red-500" : ""}`} />
                    {favorites.includes(selectedSubsidy.id) ? "お気に入り済み" : "お気に入り追加"}
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    申請を開始する <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
