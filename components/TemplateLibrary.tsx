"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, Star, FileText, TrendingUp, Calculator, CheckSquare, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// テンプレートデータ（public/templates/ ディレクトリの実ファイルにリンク）
const templates = [
  {
    id: 1,
    name: "IT導入補助金 事業計画書テンプレート",
    category: "事業計画書",
    downloads: 2847,
    rating: 4.8,
    reviews: 203,
    description: "IT導入補助金申請に最適化された事業計画書テンプレート。課題・効果・費用計画まで網羅。記載ポイントの解説付き。",
    pages: 4,
    format: "TXT",
    filename: "it-nyuusha-jigyokeikaku.txt",
    preview: "【IT導入補助金2024 事業計画書テンプレート】\n\n１．事業者概要\n・会社情報（社名・代表者・設立年月・資本金・従業員数）\n・売上・財務状況\n\n２．現状の課題・問題点\n・業務上の課題（数値で記載）\n・課題による損失の試算\n\n３．導入するITツールの概要\n・ツール名・提供事業者・機能説明\n・導入後の業務フロー比較\n\n４．期待される効果（定量・定性）\n・業務効率化効果（時間削減・コスト削減）\n・売上・利益向上効果\n\n５．費用計画・補助金申請額\n・導入費用内訳・補助率・自己負担額\n\n６．実施スケジュール\n\n７．IT導入支援事業者との連携内容\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 2,
    name: "ものづくり補助金 申請書テンプレート",
    category: "申請書類",
    downloads: 3621,
    rating: 4.9,
    reviews: 287,
    description: "ものづくり補助金（通常枠）第18回対応。革新性・競合比較・5カ年販売計画・加点項目チェックリスト収録。",
    pages: 5,
    format: "TXT",
    filename: "monodukuri-shinsho.txt",
    preview: "【ものづくり補助金（通常枠）申請書テンプレート】\n\n審査員が重視するポイント：\n★ 革新性（他社との差別化）\n★ 事業化可能性（市場ニーズと実現可能な計画）\n★ 政策適合性（地域経済への貢献）\n★ 加点項目（脱炭素・DX・賃上げ等）\n\n記載項目：\n1. 補助事業の具体的取組内容\n2. 将来の展望（事業化に向けて）\n3. 費用対効果\n4. 実施体制・スケジュール\n加点項目チェックリスト付き\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 3,
    name: "小規模事業者持続化補助金 経営計画書テンプレート",
    category: "事業計画書",
    downloads: 4102,
    rating: 4.7,
    reviews: 331,
    description: "第16回公募対応。様式2（経営計画書）＋様式3（補助事業計画書）の両方を収録。SWOT分析・費用明細表付き。",
    pages: 4,
    format: "TXT",
    filename: "jizokuka-keieikeiraku.txt",
    preview: "【小規模事業者持続化補助金 経営計画書テンプレート】\n\n様式２：経営計画書\n1. 企業概要\n2. 顧客ニーズと市場動向\n3. 自社の強み（SWOT分析）\n4. 経営方針・目標と今後のプラン\n\n様式３：補助事業計画書\n1. 補助事業で行う取組内容\n2. 補助事業の経費明細（経費区分・金額一覧）\n\n特徴：商工会議所担当者が確認しやすい形式で作成\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 4,
    name: "事業再構築補助金 事業計画書テンプレート",
    category: "事業計画書",
    downloads: 1893,
    rating: 4.6,
    reviews: 142,
    description: "成長枠（第12回）対応。現状分析・新事業の詳細・競合比較表・5カ年収支計画・認定支援機関向け確認書付き。",
    pages: 5,
    format: "TXT",
    filename: "saikoochiku-jigyokeikaku.txt",
    preview: "【事業再構築補助金（成長枠）事業計画書テンプレート】\n\n要件確認：\n・売上高10%以上の減少\n・事業再構築指針8類型への該当\n・認定経営革新等支援機関との連携\n\n記載項目：\n1. 補助事業の概要（事業名・類型・500字概要）\n2. 現状分析と再構築の必要性\n3. 新事業の具体的内容（競合比較表付き）\n4. 実施スケジュールと体制\n5. 事業化・収益計画（5カ年）\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 5,
    name: "補助金申請 収支計画書テンプレート",
    category: "収支計画",
    downloads: 2156,
    rating: 4.5,
    reviews: 178,
    description: "汎用型5カ年収支計画書。売上・原価・販管費・営業利益を自動集計できる表形式。設備投資計画・資金調達計画も収録。",
    pages: 3,
    format: "TXT",
    filename: "shuushi-keikakusho.txt",
    preview: "【補助金申請用 収支計画書テンプレート（5カ年）】\n\n収支計画表（現状〜5年後）：\n・売上高（既存事業・補助事業）\n・売上原価（材料費・労務費・外注費）\n・売上総利益・粗利率\n・販売費・一般管理費（人件費・家賃・広告費等）\n・営業利益・利益率\n\n設備投資計画・補助対象経費一覧表：\n・経費区分別の明細・金額表\n\n計画数値の前提条件・根拠の記載欄付き\n資金調達計画（補助金・自己資金・借入金）\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 6,
    name: "補助金申請書類 チェックリスト（共通版）",
    category: "申請書類",
    downloads: 5234,
    rating: 4.9,
    reviews: 412,
    description: "補助金申請前〜提出まで6段階チェックリスト。IT導入・ものづくり・持続化・再構築・助成金の個別チェック項目も収録。",
    pages: 3,
    format: "TXT",
    filename: "shinsho-checklist.txt",
    preview: "【補助金申請書類チェックリスト（共通版）】\n\nA. 申請前の必須確認事項（7項目）\nB. 電子申請システムへの入力・提出書類（証明書類一覧）\nC. 各補助金別 追加必要書類\n　- IT導入補助金\n　- ものづくり補助金\n　- 小規模事業者持続化補助金\n　- 事業再構築補助金\n　- キャリアアップ助成金\nD. 見積書チェック（8項目）\nE. 事業計画書の最終確認（6項目）\nF. 提出前の最終確認（6項目）\n\nよくある不備・落とし穴トップ10付き\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 7,
    name: "事業概要書テンプレート（汎用）",
    category: "事業計画書",
    downloads: 1672,
    rating: 4.4,
    reviews: 119,
    description: "あらゆる補助金・融資申請に使える汎用型事業概要書。会社概要・沿革・財務サマリー・強み・今後の展開をA4×2枚で網羅。",
    pages: 2,
    format: "TXT",
    filename: "jigyogaiyousho.txt",
    preview: "【事業概要書テンプレート（汎用版）】\n\n1. 会社基本情報\n　（社名・代表者・設立・資本金・従業員・所在地・HP）\n\n2. 事業内容\n　（主力事業・製品サービス一覧・主要取引先）\n\n3. 沿革（創業〜現在の主要な出来事）\n\n4. 財務サマリー（直近3期）\n　（売上高・営業利益・総資産・自己資本比率）\n\n5. 経営の強み・特徴\n　（技術・顧客基盤・人材・認定・受賞）\n\n6. 今後の事業展開\n　（中期経営目標・補助金活用計画）\n\n（全文ダウンロード後にご確認ください）",
  },
  {
    id: 8,
    name: "採択事例集・申請書ポイント解説",
    category: "参考資料",
    downloads: 3089,
    rating: 4.8,
    reviews: 256,
    description: "IT導入・ものづくり・持続化・事業再構築4補助金の実際の採択事例と採択ポイント解説。黄金ルール10か条付き。",
    pages: 4,
    format: "TXT",
    filename: "saitaku-jirei.txt",
    preview: "【採択事例集・申請書のポイント解説】\n\n事例１：IT導入補助金（食品製造業・神奈川県）\n　→ 数値による課題提示で高評価\n\n事例２：ものづくり補助金（金属プレス加工業・愛知県）\n　→ 革新性の具体的説明と賃上げ加点の活用\n\n事例３：小規模事業者持続化補助金（美容サロン・東京都）\n　→ 経営計画との一貫性と商工会議所との早期連携\n\n事例４：事業再構築補助金（飲食業→食品製造・大阪府）\n　→ 既存事業シナジーと市場データの活用\n\n補助金申請書を書く際の黄金ルール10か条付き\n採択後の手続き注意事項も収録\n\n（全文ダウンロード後にご確認ください）",
  },
];

const categories = ["すべて", "事業計画書", "申請書類", "収支計画", "参考資料"];

type CategoryIcon = typeof FileText;
const categoryIcons: Record<string, CategoryIcon> = {
  "事業計画書": FileText,
  "申請書類": CheckSquare,
  "収支計画": Calculator,
  "参考資料": BookOpen,
};

const categoryColors: Record<string, string> = {
  "事業計画書": "bg-blue-50 text-blue-600",
  "申請書類": "bg-green-50 text-green-600",
  "収支計画": "bg-purple-50 text-purple-600",
  "参考資料": "bg-orange-50 text-orange-600",
};

type Template = typeof templates[0];

export default function TemplateLibrary() {
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "すべて" || t.category === activeCategory;
    const matchSearch = t.name.includes(search) || t.description.includes(search);
    return matchCat && matchSearch;
  });

  // カテゴリ別の件数
  const catCounts = categories.slice(1).map((cat) => ({
    cat,
    count: templates.filter((t) => t.category === cat).length,
  }));

  const handleDownload = (template: Template) => {
    setDownloading(template.id);
    // public/templates/ の静的ファイルを <a> タグで直接ダウンロード
    const a = document.createElement("a");
    a.href = `/templates/${template.filename}`;
    a.download = template.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(null), 1000);
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">テンプレートライブラリ</h1>
        <p className="text-gray-500 text-sm mt-1">
          補助金申請に必要な書類テンプレートを無料ダウンロードできます（全{templates.length}件）
        </p>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-4 gap-3">
        {catCounts.map(({ cat, count }) => {
          const Icon = categoryIcons[cat] || FileText;
          const colorClass = categoryColors[cat] || "bg-gray-50 text-gray-600";
          return (
            <Card
              key={cat}
              className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveCategory(cat)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{cat}</p>
                  <p className="text-xs text-gray-500">{count}件</p>
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
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="テンプレートを検索"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((template) => {
          const Icon = categoryIcons[template.category] || FileText;
          const colorClass = categoryColors[template.category] || "bg-gray-50 text-gray-600";
          return (
            <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
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
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.floor(template.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : star - 0.5 <= template.rating
                            ? "fill-yellow-200 text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-yellow-600">{template.rating}</span>
                  <span className="text-xs text-gray-400">({template.reviews}件)</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {template.downloads.toLocaleString()}DL
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> プレビュー
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownload(template)}
                    disabled={downloading === template.id}
                  >
                    <Download className={`w-3.5 h-3.5 mr-1.5 ${downloading === template.id ? "animate-bounce" : ""}`} />
                    {downloading === template.id ? "DL中..." : "ダウンロード"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">「{search}」に一致するテンプレートは見つかりませんでした</p>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {previewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{previewTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{previewTemplate.category}</Badge>
                  <Badge className="bg-gray-100 text-gray-700">{previewTemplate.format}</Badge>
                  <Badge className="bg-gray-100 text-gray-700">{previewTemplate.pages}ページ</Badge>
                  <Badge className="bg-blue-50 text-blue-700">{previewTemplate.downloads.toLocaleString()}DL</Badge>
                </div>
                <p className="text-sm text-gray-600">{previewTemplate.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 whitespace-pre-line min-h-[200px] border border-gray-200">
                  {previewTemplate.preview}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    閉じる
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      handleDownload(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                  >
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
