"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Calendar, Clock, ChevronDown, ChevronUp, AlertCircle,
  Plus, Trash2, RefreshCw, Search, ExternalLink,
} from "lucide-react";

// ─── 型 ────────────────────────────────────────────────────────────

type StatusType = "準備中" | "申請済" | "結果待ち" | "採択" | "不採択";

type ApplicationRecord = {
  id: string;
  status: StatusType;
  notes: string | null;
  updatedAt: string;
  grant: {
    id: string;
    name: string;
    ministry: string;
    category: string;
    maxAmount: number;
    deadline: string | null;
    url: string | null;
    tags: string[];
  };
};

type GrantResult = {
  id: string;
  name: string;
  ministry: string;
  category: string;
  maxAmount: number;
  deadline: string | null;
};

// ─── 定数 ──────────────────────────────────────────────────────────

const STATUS_LIST: StatusType[] = ["準備中", "申請済", "結果待ち", "採択", "不採択"];

const STATUS_CONFIG: Record<StatusType, { color: string; progress: number }> = {
  準備中:   { color: "bg-yellow-100 text-yellow-700 border-yellow-200", progress: 30  },
  申請済:   { color: "bg-blue-100 text-blue-700 border-blue-200",       progress: 70  },
  結果待ち: { color: "bg-purple-100 text-purple-700 border-purple-200", progress: 90  },
  採択:     { color: "bg-green-100 text-green-700 border-green-200",    progress: 100 },
  不採択:   { color: "bg-red-100 text-red-700 border-red-200",          progress: 100 },
};

// ─── ヘルパー ──────────────────────────────────────────────────────

function calcDaysLeft(deadline: string | null | undefined): number | null {
  if (!deadline || deadline === "通年" || deadline === "要確認") return null;
  const parts = deadline.split("/").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59);
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ─── コンポーネント ─────────────────────────────────────────────────

export default function ApplicationManager() {
  const [records, setRecords] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [grantSearch, setGrantSearch] = useState("");
  const [grantResults, setGrantResults] = useState<GrantResult[]>([]);
  const [grantLoading, setGrantLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── データ取得 ──
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subsidy/status");
      if (res.ok) {
        const data = await res.json() as { statuses: ApplicationRecord[] };
        setRecords(data.statuses);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchRecords(); }, [fetchRecords]);

  // ── 補助金検索 ──
  const searchGrants = useCallback(async (q: string) => {
    if (q.length < 1) { setGrantResults([]); return; }
    setGrantLoading(true);
    try {
      const res = await fetch(`/api/grants?search=${encodeURIComponent(q)}&limit=10`);
      if (res.ok) {
        const data = await res.json() as { grants: GrantResult[] };
        setGrantResults(data.grants);
      }
    } catch { /* ignore */ }
    finally { setGrantLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { void searchGrants(grantSearch); }, 400);
    return () => clearTimeout(t);
  }, [grantSearch, searchGrants]);

  // ── 追加 ──
  const addApplication = async (subsidyId: string) => {
    // 既登録チェック
    if (records.some((r) => r.grant.id === subsidyId)) {
      alert("すでに申請管理に追加されています");
      return;
    }
    try {
      const res = await fetch("/api/subsidy/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subsidyId, status: "準備中" }),
      });
      if (res.ok) {
        setAddOpen(false);
        setGrantSearch("");
        setGrantResults([]);
        void fetchRecords();
      }
    } catch { /* ignore */ }
  };

  // ── ステータス更新 ──
  const updateStatus = async (id: string, status: StatusType) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/subsidy/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      }
    } catch { /* ignore */ }
    finally { setUpdatingId(null); }
  };

  // ── 削除 ──
  const deleteRecord = async (id: string) => {
    if (!confirm("この補助金を申請管理から削除しますか？")) return;
    try {
      await fetch("/api/subsidy/status", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch { /* ignore */ }
  };

  const statusCounts = STATUS_LIST.reduce((acc, s) => {
    acc[s] = records.filter((r) => r.status === s).length;
    return acc;
  }, {} as Record<StatusType, number>);

  // 自分の申請中グラントの締切カレンダー
  const calendarItems = records
    .filter((r) => {
      const dl = calcDaysLeft(r.grant.deadline);
      return dl !== null && dl > 0 && dl <= 90;
    })
    .sort((a, b) => (calcDaysLeft(a.grant.deadline) ?? 999) - (calcDaysLeft(b.grant.deadline) ?? 999))
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      {/* ── ヘッダー ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">申請状況管理</h1>
          <p className="text-gray-500 text-sm mt-1">申請中の補助金の進捗状況を管理します</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRecords} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            更新
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />補助金を追加
          </Button>
        </div>
      </div>

      {/* ── ステータスサマリー ── */}
      <div className="grid grid-cols-5 gap-3">
        {STATUS_LIST.map((s) => (
          <div key={s} className={`${STATUS_CONFIG[s].color} border rounded-xl p-3 text-center`}>
            <p className="text-xs font-medium">{s}</p>
            <p className="text-2xl font-bold mt-1">{loading ? "—" : statusCounts[s]}</p>
            <p className="text-xs opacity-70">件</p>
          </div>
        ))}
      </div>

      {/* ── 申請一覧 ── */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />読み込み中...
        </div>
      ) : records.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20 text-gray-400" />
            <p className="text-lg font-medium text-gray-500">申請管理中の補助金はありません</p>
            <p className="text-sm text-gray-400 mt-1">
              「補助金を追加」から管理したい補助金を追加してください
            </p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />補助金を追加する
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const daysLeft = calcDaysLeft(rec.grant.deadline);
            const cfg = STATUS_CONFIG[rec.status];
            return (
              <Card key={rec.id} className="border-0 shadow-sm overflow-hidden">
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{rec.grant.name}</h3>
                          <Badge className={`${cfg.color} border text-xs flex-shrink-0`}>{rec.status}</Badge>
                          {daysLeft !== null && daysLeft <= 14 && daysLeft > 0 && (
                            <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs flex items-center gap-1 flex-shrink-0">
                              <AlertCircle className="w-3 h-3" />締切注意
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          <span>{rec.grant.ministry}</span>
                          {rec.grant.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />締切: {rec.grant.deadline}
                            </span>
                          )}
                          {daysLeft !== null && daysLeft > 0 && (
                            <span className="font-medium text-orange-600">残り{daysLeft}日</span>
                          )}
                          {daysLeft !== null && daysLeft <= 0 && (
                            <span className="font-medium text-gray-400">受付終了</span>
                          )}
                          <span>最大{rec.grant.maxAmount.toLocaleString()}万円</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">進捗</p>
                          <p className="text-sm font-bold text-blue-600">{cfg.progress}%</p>
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    <Progress value={cfg.progress} className="h-2" />
                  </CardContent>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    {/* ステータス変更 */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-600 font-medium">ステータス変更:</span>
                      <Select
                        value={rec.status}
                        onValueChange={(v) => { if (v) void updateStatus(rec.id, v as StatusType); }}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_LIST.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingId === rec.id && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      )}
                    </div>

                    {/* タグ */}
                    {rec.grant.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rec.grant.tags.slice(0, 5).map((t) => (
                          <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* アクション */}
                    <div className="flex gap-2">
                      {rec.grant.url && (
                        <a href={rec.grant.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />公式ページ
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                        onClick={() => void deleteRecord(rec.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />削除
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── 締切カレンダー（自分の申請中のみ） ── */}
      {calendarItems.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">締切カレンダー（申請中）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {calendarItems.map((item) => {
                const dl = calcDaysLeft(item.grant.deadline);
                const urgent = dl !== null && dl <= 14;
                return (
                  <div
                    key={item.id}
                    className={`${urgent ? "ring-2 ring-red-400 ring-offset-1" : ""} bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors cursor-pointer`}
                    onClick={() => { if (item.grant.url) window.open(item.grant.url, "_blank"); }}
                  >
                    <p className="text-lg font-bold text-gray-800">
                      {item.grant.deadline?.slice(5).replace("/", "/")}
                    </p>
                    <div className={`${urgent ? "bg-red-400" : "bg-orange-400"} rounded-full h-1 my-2`} />
                    <p className="text-xs text-gray-600 line-clamp-2">{item.grant.name}</p>
                    {urgent && (
                      <p className="text-xs text-red-500 font-medium mt-1">⚠️ 残り{dl}日</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 追加モーダル ── */}
      <Dialog open={addOpen} onOpenChange={(open) => {
        setAddOpen(open);
        if (!open) { setGrantSearch(""); setGrantResults([]); }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>補助金を申請管理に追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="補助金名で検索..."
                className="pl-9"
                value={grantSearch}
                onChange={(e) => setGrantSearch(e.target.value)}
                autoFocus
              />
            </div>

            {grantLoading && (
              <div className="text-center py-4 text-gray-400 text-sm">
                <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />検索中...
              </div>
            )}

            {grantResults.length > 0 && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {grantResults.map((g) => {
                  const alreadyAdded = records.some((r) => r.grant.id === g.id);
                  return (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        alreadyAdded
                          ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                          : "border-gray-100 hover:bg-blue-50 cursor-pointer"
                      }`}
                      onClick={() => { if (!alreadyAdded) void addApplication(g.id); }}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{g.name}</p>
                        <p className="text-xs text-gray-500">
                          {g.ministry} | 最大{g.maxAmount.toLocaleString()}万円 | {g.deadline ?? "通年"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs flex-shrink-0"
                        disabled={alreadyAdded}
                        variant={alreadyAdded ? "outline" : "default"}
                      >
                        {alreadyAdded ? "追加済" : "追加"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {grantSearch.length > 0 && !grantLoading && grantResults.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">
                該当する補助金が見つかりませんでした
              </p>
            )}

            {grantSearch.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">
                補助金名を入力して検索してください
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
