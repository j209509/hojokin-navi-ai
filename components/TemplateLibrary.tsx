"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, Star, FileText, TrendingUp, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const templates = [
  { id: 1, name: "IT導入補助金 事業計画書テンプレート", category: "事業計画書", downloads: 1234, rating: 4.8, reviews: 89, description: "IT導入補助金申請に最適化された事業計画書テンプレート。審査員に響く記載ポイントを解説付きで提供。", pages: 12, format: "Word", preview: "本テンプレートは、IT導入補助金の申請に必要な事業計画書を作成するためのものです。\n\n【記載項目】\n1. 事業概要\n2. 現状の課題と解決策\n3. 導入するITツールの詳細\n4. 期待される効果（定量・定性）\n5. 実施スケジュール\n6. 費用対効果の分析..." },
  { id: 2, name: "ものづくり補助金 申請書テンプレート", category: "申請書類", downloads: 987, rating: 4.6, reviews: 62, description: "ものづくり補助金の申請書作成に特化したテンプレート。革新性・加点項目の記載例も収録。", pages: 20, format: "Word", preview: "ものづくり補助金申請書\n\n【事業計画の概要】\n（革新的な取り組みの内容を具体的に記載）\n\n【市場ニーズ】\n（ターゲット市場と顧客ニーズの分析）\n\n【技術的優位性】\n（競合他社との差別化ポイント）..." },
  { id: 3, name: "補助金申請用 収支計画書", category: "収支計画", downloads: 756, rating: 4.7, reviews: 51, description: "補助金申請で求められる収支計画を自動計算するExcelテンプレート。5年間の財務予測機能付き。", pages: 5, format: "Excel", preview: "収支計画書（5カ年計画）\n\n売上高予測：\n1年目：5,000万円\n2年目：6,500万円（30%増）\n3年目：8,000万円（23%増）\n...\n\n費用計画：\n人件費・経費・設備減価償却費等を自動計算..." },
  { id: 4, name: "小規模事業者持続化補助金 経営計画書", category: "事業計画書", downloads: 1456, rating: 4.9, reviews: 113, description: "採択率が高い経営計画書の書き方を具体的な例文とともに解説。商工会議所への提出用に最適化。", pages: 8, format: "Word", preview: "経営計画書\n\n会社の概要\n商号：株式会社○○\n代表者：山田 太郎\n設立：20XX年X月X日\n資本金：XXX万円\n従業員数：X名\n\n顧客ニーズと市場動向：..." },
  { id: 5, name: "事業再構築補助金 事業計画書（新分野展開）", category: "事業計画書", downloads: 678, rating: 4.5, reviews: 44, description: "新分野展開類型に特化した事業計画書テンプレート。市場分析から財務計画まで網羅的に対応。", pages: 25, format: "Word", preview: "事業再構築補助金 事業計画書\n\n【事業再構築の内容】\n新分野展開の具体的な内容と、既存事業との関連性を明確に記載します。\n\n【新事業の市場規模と競合分析】..." },
  { id: 6, name: "補助金申請 見積書チェックリスト", category: "申請書類", downloads: 543, rating: 4.4, reviews: 37, description: "補助金申請に必要な見積書の確認ポイントをまとめたチェックリスト。審査落ちを防ぐ必須項目を網羅。", pages: 3, format: "PDF", preview: "見積書チェックリスト\n\n□ 見積日が申請日より前になっているか\n□ 見積有効期限が明記されているか\n□ 単価と数量が明記されているか\n□ 税抜・税込の表示が正確か\n□ 会社印・担当者名が記載されているか..." },
  { id: 7, name: "省エネ設備 導入効果計算書", category: "収支計画", downloads: 389, rating: 4.3, reviews: 28, description: "省エネ補助金申請に必要な省エネ効果の計算を自動化するExcelテンプレート。CO2削減量も自動算出。", pages: 6, format: "Excel", preview: "省エネ効果計算書\n\n現状設備の消費電力：XXX kWh/年\n導入後の消費電力：XXX kWh/年\n省エネ率：XX%\n\nCO2削減量：XX t-CO2/年\n電気代削減額：年間XX万円..." },
  { id: 8, name: "雇用助成金 申請書類一式", category: "申請書類", downloads: 892, rating: 4.6, reviews: 71, description: "各種雇用関係助成金の申請に必要な書類のテンプレート集。雇用調整助成金・キャリアアップ助成金対応。", pages: 15, format: "Word", preview: "雇用関係助成金 申請書類一式\n\n収録書類：\n1. 支給申請書\n2. 休業等実施計画（変更）届\n3. 休業・教育訓練実績一覧表\n4. 助成対象労働者一覧表..." },
];

const categories = ["すべて", "事業計画書", "申請書類", "収支計画"];

type CategoryIcon = typeof FileText;
const categoryIcons: Record<string, CategoryIcon> = {
  "事業計画書": FileText,
  "申請書類": TrendingUp,
  "収支計画": Calculator,
};

type Template = typeof templates[0];

export default function TemplateLibrary() {
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "すべて" || t.category === activeCategory;
    const matchSearch = t.name.includes(search) || t.description.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">テンプレートライブラリ</h1>
        <p className="text-gray-500 text-sm mt-1">補助金申請に必要な書類テンプレートをダウンロードできます</p>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { cat: "事業計画書", count: templates.filter((t) => t.category === "事業計画書").length, icon: FileText, color: "bg-blue-50 text-blue-600" },
          { cat: "申請書類", count: templates.filter((t) => t.category === "申請書類").length, icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { cat: "収支計画", count: templates.filter((t) => t.category === "収支計画").length, icon: Calculator, color: "bg-purple-50 text-purple-600" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.cat} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveCategory(item.cat)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.cat}</p>
                  <p className="text-xs text-gray-500">{item.count}件のテンプレート</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeCategory === cat ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="テンプレートを検索" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((template) => {
          const Icon = categoryIcons[template.category] || FileText;
          return (
            <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      <span className="text-xs text-gray-400">{template.format} · {template.pages}ページ</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{template.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.floor(template.rating) ? "fill-yellow-400 text-yellow-400" : star - 0.5 <= template.rating ? "fill-yellow-200 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-yellow-600">{template.rating}</span>
                  <span className="text-xs text-gray-400">({template.reviews}件)</span>
                  <span className="text-xs text-gray-400 ml-auto">{template.downloads.toLocaleString()}DL</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setPreviewTemplate(template)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> プレビュー
                  </Button>
                  <Button size="sm" className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Download className="w-3.5 h-3.5 mr-1.5" /> ダウンロード
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {previewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{previewTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline">{previewTemplate.category}</Badge>
                  <Badge className="bg-gray-100 text-gray-700">{previewTemplate.format}</Badge>
                  <Badge className="bg-gray-100 text-gray-700">{previewTemplate.pages}ページ</Badge>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 whitespace-pre-line min-h-[200px]">
                  {previewTemplate.preview}
                  {"\n\n...\n\n（このテンプレートには合計" + previewTemplate.pages + "ページの内容が含まれています）"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setPreviewTemplate(null)}>閉じる</Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" /> ダウンロード
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
