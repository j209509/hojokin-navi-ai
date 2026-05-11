"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search, Heart, ArrowRight, Clock, TrendingUp,
  ExternalLink, RefreshCw, Database, Wifi, AlertCircle,
  ChevronLeft, ChevronRight, Flame, AlertTriangle, CheckCircle2, CalendarClock,
} from "lucide-react";

// ─── 型 ────────────────────────────────────────────────────────────

type Grant = {
  id: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  maxAmount: number;
  adoptionRate?: number | null;
  deadline?: string | null;
  tags: string[];
  url?: string | null;
  jgrantsId?: string | null;
  isActive?: boolean;
};

type DataSource = "database" | "jgrants" | "mock" | null;

// 締切の緊急度
type DeadlineUrgency =
  | "expired"     // 締切済み
  | "critical"    // 3日以内（実質手遅れ）
  | "urgent"      // 7日以内
  | "soon"        // 14日以内
  | "month"       // 1ヶ月以内
  | "ok"          // 1ヶ月以上
  | "open";       // 通年

// ─── 定数 ──────────────────────────────────────────────────────────

const MINISTRY_TABS = ["すべて", "経産省・中企庁", "厚労省", "環境省", "農水省", "自治体", "その他"];
const CATEGORY_OPTIONS = [
  "すべてのカテゴリ", "デジタル化", "設備投資", "人材育成", "販路開拓",
  "省エネ", "事業転換", "雇用", "農業", "観光", "創業", "技術開発",
  "海外展開", "地域活性化", "事業承継", "医療・福祉", "建設・住宅", "その他",
];
const AMOUNT_OPTIONS = [
  "すべての金額", "〜100万円", "100〜500万円", "500〜2000万円", "2000万円以上",
];
const DEADLINE_OPTIONS = [
  "すべての期限", "受付中のみ", "1週間以内", "2週間以内", "1ヶ月以内", "通年のみ",
];
const PAGE_SIZE = 20;

const SOURCE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  database: { label: "DB接続中",      color: "text-green-600 border-green-300 bg-green-50", icon: <Database className="w-3 h-3" /> },
  jgrants:  { label: "jGrantsライブ", color: "text-blue-600 border-blue-300 bg-blue-50",   icon: <Wifi className="w-3 h-3" /> },
  mock:     { label: "デモデータ",    color: "text-gray-500 border-gray-300 bg-gray-50",    icon: <AlertCircle className="w-3 h-3" /> },
};

// ─── 締切計算ヘルパー ────────────────────────────────────────────────

function calcDeadlineInfo(deadline?: string | null): {
  urgency: DeadlineUrgency;
  daysLeft: number | null;
  label: string;
  badgeClass: string;
  cardClass: string;
} {
  if (!deadline || deadline === "通年" || deadline === "要確認") {
    return { urgency: "open", daysLeft: null, label: "通年受付", badgeClass: "bg-green-100 text-green-700 border-green-200", cardClass: "" };
  }

  const parts = deadline.split("/").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) {
    return { urgency: "ok", daysLeft: null, label: deadline, badgeClass: "bg-gray-100 text-gray-600 border-gray-200", cardClass: "" };
  }

  const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { urgency: "expired", daysLeft, label: "受付終了", badgeClass: "bg-gray-200 text-gray-500 border-gray-300", cardClass: "opacity-50" };
  }
  if (daysLeft <= 3) {
    return { urgency: "critical", daysLeft, label: `残り${daysLeft}日 ⚠️手遅れ注意`, badgeClass: "bg-red-600 text-white border-red-700", cardClass: "border-red-200 bg-red-50/30" };
  }
  if (daysLeft <= 7) {
    return { urgency: "urgent", daysLeft, label: `残り${daysLeft}日`, badgeClass: "bg-red-100 text-red-700 border-red-300", cardClass: "border-orange-200" };
  }
  if (daysLeft <= 14) {
    return { urgency: "soon", daysLeft, label: `残り${daysLeft}日`, badgeClass: "bg-orange-100 text-orange-700 border-orange-200", cardClass: "border-orange-100" };
  }
  if (daysLeft <= 31) {
    return { urgency: "month", daysLeft, label: `残り${daysLeft}日`, badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-200", cardClass: "" };
  }
  return { urgency: "ok", daysLeft, label: deadline, badgeClass: "bg-gray-100 text-gray-600 border-gray-200", cardClass: "" };
}

// ─── コンポーネント ─────────────────────────────────────────────────

export default function SubsidyDatabase() {
  const [grants, setGrants]         = useState<Grant[]>([]);
  const [total, setTotal]           = useState(0);
  const [source, setSource]         = useState<DataSource>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory]     = useState("すべてのカテゴリ");
  const [activeTab, setActiveTab]   = useState("すべて");
  const [amount, setAmount]         = useState("すべての金額");
  const [deadlineFilter, setDeadlineFilter] = useState("受付中のみ"); // デフォルト：受付中のみ
  const [page, setPage]             = useState(0);
  const [favorites, setFavorites]   = useState<string[]>([]);
  const [selected, setSelected]     = useState<Grant | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(0); }, [activeTab, category, amount, deadlineFilter]);

  const fetchGrants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category !== "すべてのカテゴリ") params.set("category", category);
      const mf = getMinistryFilter(activeTab);
      if (mf) params.set("ministry", mf);

      // 受付中フィルタ
      if (deadlineFilter === "受付中のみ") params.set("activeOnly", "true");

      const res = await fetch(`/api/grants?${params.toString()}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json() as { grants: Grant[]; total: number; source: DataSource };

      // クライアント側フィルタ（金額 + 締切期間）
      let filtered = filterByAmount(data.grants, amount);
      filtered = filterByDeadline(filtered, deadlineFilter);

      setGrants(filtered);
      setTotal(data.total);
      setSource(data.source);
    } catch {
      setGrants([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, activeTab, amount, deadlineFilter, page]);

  useEffect(() => { void fetchGrants(); }, [fetchGrants]);

  const toggleFav = (id: string) =>
    setFavorites((p) => p.includes(id) ? p.filter((f) => f !== id) : [...p, id]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const sourceInfo = source ? SOURCE_LABELS[source] : null;

  // 締切切れの件数カウント（警告表示用）
  const criticalCount = grants.filter((g) => {
    const { urgency } = calcDeadlineInfo(g.deadline);
    return urgency === "critical";
  }).length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">補助金データベース</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "読み込み中..." : `${grants.length.toLocaleString()}件表示 / 総${total.toLocaleString()}件`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sourceInfo && (
            <Badge variant="outline" className={`text-xs gap-1 ${sourceInfo.color}`}>
              {sourceInfo.icon}{sourceInfo.label}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={fetchGrants} disabled={loading} className="h-8">
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            更新
          </Button>
        </div>
      </div>

      {/* 残り3日以内の警告バナー */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-red-700">⚠️ 締切3日以内が{criticalCount}件あります。</span>
            <span className="text-red-600 ml-1">書類準備・申請機関への確認はお早めに（実質的に申込み困難な場合があります）。</span>
          </div>
        </div>
      )}

      {/* Ministry Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
        {MINISTRY_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="補助金名・キーワードで検索" className="pl-9" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* 締切フィルタ（最重要 → 左側に配置） */}
        <Select value={deadlineFilter} onValueChange={(v) => { if (v) setDeadlineFilter(v); }}>
          <SelectTrigger className={`w-40 ${deadlineFilter === "受付中のみ" ? "border-blue-400 text-blue-700 font-medium" : ""}`}>
            <CalendarClock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEADLINE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={(v) => { if (v) setCategory(v); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="カテゴリ" /></SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={amount} onValueChange={(v) => { if (v) setAmount(v); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="金額帯" /></SelectTrigger>
          <SelectContent>
            {AMOUNT_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* 締切凡例 */}
      <div className="flex gap-2 flex-wrap text-xs">
        {[
          { cls: "bg-red-600 text-white border-red-700",        label: "残り3日以内 ⚠️" },
          { cls: "bg-red-100 text-red-700 border-red-300",      label: "残り7日以内" },
          { cls: "bg-orange-100 text-orange-700 border-orange-200", label: "残り14日以内" },
          { cls: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "残り1ヶ月以内" },
          { cls: "bg-green-100 text-green-700 border-green-200",    label: "通年受付" },
        ].map((item) => (
          <span key={item.label} className={`px-2 py-0.5 rounded-full border text-xs ${item.cls}`}>
            {item.label}
          </span>
        ))}
      </div>

      {/* Grant Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : grants.length === 0 ? (
        <EmptyState onReset={() => {
          setSearch(""); setCategory("すべてのカテゴリ");
          setActiveTab("すべて"); setAmount("すべての金額");
          setDeadlineFilter("受付中のみ");
        }} />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {grants.map((grant) => (
            <GrantCard key={grant.id} grant={grant}
              isFav={favorites.includes(grant.id)}
              onToggleFav={() => toggleFav(grant.id)}
              onClick={() => setSelected(grant)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">{page + 1} / {totalPages} ページ</span>
          <Button variant="outline" size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || loading}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && <GrantDetail grant={selected} isFav={favorites.includes(selected.id)}
            onToggleFav={() => toggleFav(selected.id)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── GrantCard ──────────────────────────────────────────────────────

function GrantCard({ grant, isFav, onToggleFav, onClick }: {
  grant: Grant; isFav: boolean; onToggleFav: () => void; onClick: () => void;
}) {
  const dl = calcDeadlineInfo(grant.deadline);
  const isExpired = dl.urgency === "expired";

  return (
    <Card
      className={`border shadow-sm hover:shadow-md transition-all cursor-pointer group ${dl.cardClass} ${isExpired ? "border-gray-200" : "border-0"}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* ─ ヘッダー ─ */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <Badge variant="outline" className="text-xs">{grant.ministry}</Badge>
              <Badge className="text-xs bg-slate-100 text-slate-600 border-0">{grant.category}</Badge>
            </div>
            <h3 className={`font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors ${isExpired ? "text-gray-400" : "text-gray-900"}`}>
              {grant.name}
            </h3>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
            className="p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0">
            <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
          </button>
        </div>

        <p className={`text-xs line-clamp-2 mb-3 ${isExpired ? "text-gray-400" : "text-gray-500"}`}>
          {grant.description}
        </p>

        {/* ─ タグ ─ */}
        {grant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {grant.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${isExpired ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600"}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ─ フッター ─ */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="space-y-1.5">
            <p className={`text-base font-bold ${isExpired ? "text-gray-400" : "text-blue-700"}`}>
              {grant.maxAmount > 0 ? `最大${grant.maxAmount.toLocaleString()}万円` : "金額要確認"}
            </p>
            {/* 締切バッジ（最重要） */}
            <DeadlineBadge dl={dl} />
          </div>
          <Button size="sm" className="h-7 text-xs"
            disabled={isExpired}
            onClick={(e) => { e.stopPropagation(); if (grant.url && !isExpired) window.open(grant.url, "_blank"); }}>
            {isExpired ? "受付終了" : <>詳細 <ArrowRight className="w-3 h-3 ml-1" /></>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 締切バッジ ─────────────────────────────────────────────────────

function DeadlineBadge({ dl }: { dl: ReturnType<typeof calcDeadlineInfo> }) {
  const icons: Partial<Record<DeadlineUrgency, React.ReactNode>> = {
    critical: <Flame className="w-3 h-3" />,
    urgent:   <AlertTriangle className="w-3 h-3" />,
    soon:     <Clock className="w-3 h-3" />,
    month:    <Clock className="w-3 h-3" />,
    open:     <CheckCircle2 className="w-3 h-3" />,
    ok:       <Clock className="w-3 h-3" />,
    expired:  <Clock className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${dl.badgeClass}`}>
      {icons[dl.urgency]}
      {dl.label}
    </span>
  );
}

// ─── 詳細モーダル ───────────────────────────────────────────────────

function GrantDetail({ grant, isFav, onToggleFav }: {
  grant: Grant; isFav: boolean; onToggleFav: () => void;
}) {
  const dl = calcDeadlineInfo(grant.deadline);
  const isExpired = dl.urgency === "expired";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold leading-snug">{grant.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap items-center">
          <Badge variant="outline">{grant.ministry}</Badge>
          <Badge className="bg-gray-100 text-gray-700">{grant.category}</Badge>
          {grant.jgrantsId && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">jGrants公式</Badge>}
          <DeadlineBadge dl={dl} />
        </div>

        {/* 締切警告 */}
        {dl.urgency === "critical" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            <strong>⚠️ 締切まで{dl.daysLeft}日です。</strong>
            書類準備・必要書類の取得・申請機関への連絡には通常1〜2週間かかります。すぐに申請機関へ確認してください。
          </div>
        )}
        {dl.urgency === "urgent" && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
            <strong>締切まで{dl.daysLeft}日。</strong>今すぐ申請機関に連絡・書類準備を開始してください。
          </div>
        )}
        {dl.urgency === "soon" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
            締切まで{dl.daysLeft}日。書類準備を急いで進めましょう。
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed">{grant.description}</p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "最大補助額", value: grant.maxAmount > 0 ? `${grant.maxAmount.toLocaleString()}万円` : "要確認", color: "text-blue-700" },
            { label: "申請締切",   value: grant.deadline ?? "要確認", color: isExpired ? "text-gray-400" : dl.urgency === "critical" ? "text-red-700 font-bold" : "text-orange-600" },
            { label: "採択率",     value: grant.adoptionRate ? `${grant.adoptionRate}%` : "—", color: "text-green-600" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className={`font-bold ${item.color} mt-1 text-sm`}>{item.value}</p>
            </div>
          ))}
        </div>

        {grant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {grant.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onToggleFav}>
            <Heart className={`w-4 h-4 mr-2 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
            {isFav ? "お気に入り済み" : "お気に入り"}
          </Button>
          {grant.url && !isExpired ? (
            <a href={grant.url} target="_blank" rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 transition-colors">
              詳細・申請 <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </a>
          ) : (
            <Button className="flex-1" disabled={isExpired}>
              {isExpired ? "受付終了" : <>申請を開始する <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── スケルトン / 空状態 ─────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-4" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-lg font-medium text-gray-500">該当する補助金が見つかりませんでした</p>
      <p className="text-sm mt-1">受付中以外も含めて探す場合は締切フィルタを「すべての期限」に変更してください</p>
      <Button variant="outline" className="mt-4" onClick={onReset}>フィルタをリセット</Button>
    </div>
  );
}

// ─── APIフィルタ用ヘルパー ──────────────────────────────────────────

function getMinistryFilter(tab: string): string {
  switch (tab) {
    case "経産省・中企庁": return "経産省";
    case "厚労省":        return "厚労省";
    case "環境省":        return "環境省";
    case "農水省":        return "農水省";
    default:              return "";
  }
}

function filterByAmount(grants: Grant[], filter: string): Grant[] {
  if (filter === "すべての金額") return grants;
  return grants.filter((g) => {
    const a = g.maxAmount;
    if (filter === "〜100万円")      return a > 0 && a <= 100;
    if (filter === "100〜500万円")   return a > 100 && a <= 500;
    if (filter === "500〜2000万円")  return a > 500 && a <= 2000;
    if (filter === "2000万円以上")   return a > 2000;
    return true;
  });
}

function filterByDeadline(grants: Grant[], filter: string): Grant[] {
  if (filter === "すべての期限") return grants;
  if (filter === "通年のみ") return grants.filter((g) => !g.deadline || g.deadline === "通年");

  const now = Date.now();
  return grants.filter((g) => {
    if (!g.deadline || g.deadline === "通年") {
      // 通年は「受付中」などすべてに含める
      return filter !== "通年のみ";
    }
    const parts = g.deadline.split("/").map(Number);
    if (parts.length < 3) return true;
    const deadlineMs = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59).getTime();
    const daysLeft = (deadlineMs - now) / (1000 * 60 * 60 * 24);

    if (filter === "受付中のみ")  return daysLeft > 0;
    if (filter === "1週間以内")   return daysLeft > 0 && daysLeft <= 7;
    if (filter === "2週間以内")   return daysLeft > 0 && daysLeft <= 14;
    if (filter === "1ヶ月以内")   return daysLeft > 0 && daysLeft <= 31;
    return true;
  });
}
