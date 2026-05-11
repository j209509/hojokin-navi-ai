"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { FileText, Clock, CheckCircle, XCircle, Loader2, Plus, Trash2, Edit3 } from "lucide-react";

// ─── 型定義 ──────────────────────────────────────

interface Grant {
  id: string;
  name: string;
  ministry: string;
  maxAmount: number;
  deadline?: string;
}

interface SubsidyStatus {
  id: string;
  subsidyId: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  grant: Grant;
}

type StatusType = "準備中" | "申請済" | "結果待ち" | "採択" | "不採択";

const STATUS_CONFIG: Record<StatusType, { color: string; bg: string; icon: React.ReactNode }> = {
  準備中:   { color: "text-gray-600",  bg: "bg-gray-100",  icon: <Clock className="w-4 h-4" /> },
  申請済:   { color: "text-blue-600",  bg: "bg-blue-100",  icon: <FileText className="w-4 h-4" /> },
  結果待ち: { color: "text-yellow-600", bg: "bg-yellow-100", icon: <Loader2 className="w-4 h-4 animate-spin" /> },
  採択:     { color: "text-green-600", bg: "bg-green-100", icon: <CheckCircle className="w-4 h-4" /> },
  不採択:   { color: "text-red-600",   bg: "bg-red-100",   icon: <XCircle className="w-4 h-4" /> },
};

const ALL_STATUSES: StatusType[] = ["準備中", "申請済", "結果待ち", "採択", "不採択"];

// ─── モックデータ (DB 未接続時) ──────────────────

const MOCK_STATUSES: SubsidyStatus[] = [
  {
    id: "mock-1",
    subsidyId: "grant-1",
    status: "申請済",
    notes: "書類一式を郵送済み。結果待ち。",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    grant: { id: "grant-1", name: "IT導入補助金 2024", ministry: "経済産業省", maxAmount: 450, deadline: "2024年12月31日" },
  },
  {
    id: "mock-2",
    subsidyId: "grant-2",
    status: "準備中",
    notes: "事業計画書を作成中。",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    grant: { id: "grant-2", name: "ものづくり補助金", ministry: "経済産業省", maxAmount: 1250, deadline: "2024年10月31日" },
  },
  {
    id: "mock-3",
    subsidyId: "grant-3",
    status: "採択",
    notes: "採択通知受領。交付申請を進める。",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    grant: { id: "grant-3", name: "小規模事業者持続化補助金", ministry: "中小企業庁", maxAmount: 200, deadline: "終了" },
  },
];

// ─── サブコンポーネント ──────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as StatusType] ?? STATUS_CONFIG["準備中"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      {cfg.icon}
      {status}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}

// ─── メインコンポーネント ─────────────────────────

export default function ApplicationDashboard() {
  const { data, error, isLoading } = useSWR<{ statuses: SubsidyStatus[] }>(
    "/api/subsidy/status",
    fetcher,
    { refreshInterval: 30000 }
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("すべて");
  const [submitting, setSubmitting] = useState(false);

  // DB 未接続時はモックデータで表示
  const statuses: SubsidyStatus[] = data?.statuses ?? (error ? MOCK_STATUSES : []);
  const isMock = !!error;

  const filtered = filterStatus === "すべて"
    ? statuses
    : statuses.filter((s) => s.status === filterStatus);

  // 統計
  const stats = {
    total:    statuses.length,
    adopted:  statuses.filter((s) => s.status === "採択").length,
    pending:  statuses.filter((s) => s.status === "結果待ち" || s.status === "申請済").length,
    rejected: statuses.filter((s) => s.status === "不採択").length,
  };

  // 編集開始
  const startEdit = (s: SubsidyStatus) => {
    setEditingId(s.id);
    setEditStatus(s.status);
    setEditNotes(s.notes ?? "");
  };

  // 編集保存
  const saveEdit = async (id: string) => {
    if (isMock) { setEditingId(null); return; }
    setSubmitting(true);
    try {
      await fetch("/api/subsidy/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: editStatus, notes: editNotes }),
      });
      await mutate("/api/subsidy/status");
    } finally {
      setSubmitting(false);
      setEditingId(null);
    }
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm("この申請状況を削除しますか？")) return;
    if (isMock) return;
    await fetch("/api/subsidy/status", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await mutate("/api/subsidy/status");
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">申請状況ダッシュボード</h2>
          <p className="text-sm text-gray-500 mt-0.5">補助金の申請進捗をリアルタイムで管理</p>
        </div>
        {isMock && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
            デモデータ表示中
          </span>
        )}
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="申請総数"   value={stats.total}    color="text-gray-900" />
        <StatCard label="採択"       value={stats.adopted}  color="text-green-600" />
        <StatCard label="審査中"     value={stats.pending}  color="text-blue-600" />
        <StatCard label="不採択"     value={stats.rejected} color="text-red-600" />
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-2">
        {["すべて", ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ローディング */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-500 text-sm">読み込み中...</span>
        </div>
      )}

      {/* リスト */}
      {!isLoading && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">申請中の補助金はありません</p>
              <p className="text-xs mt-1">AIマッチングで補助金を見つけて申請を開始しましょう</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-200 transition-colors"
              >
                {editingId === item.id ? (
                  /* 編集モード */
                  <div className="space-y-3">
                    <p className="font-medium text-gray-900">{item.grant.name}</p>
                    <div className="flex gap-2 flex-wrap">
                      {ALL_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setEditStatus(s)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            editStatus === s
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="メモ・備考"
                      rows={2}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={submitting}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        保存
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 表示モード */
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-900 truncate">{item.grant.name}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span>{item.grant.ministry}</span>
                        <span>最大 {item.grant.maxAmount.toLocaleString()}万円</span>
                        {item.grant.deadline && <span>締切: {item.grant.deadline}</span>}
                      </div>
                      {item.notes && (
                        <p className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">
                          {item.notes}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400">
                        更新: {new Date(item.updatedAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="編集"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 新規追加ヒント */}
      {!isMock && !isLoading && (
        <p className="text-xs text-center text-gray-400">
          <Plus className="w-3 h-3 inline mr-1" />
          AIマッチング画面でブックマークした補助金から申請を開始できます
        </p>
      )}
    </div>
  );
}
