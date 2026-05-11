"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminSync from "@/components/AdminSync";
import {
  Users, Database, Brain, RefreshCw,
  ShieldCheck, TrendingUp, BookmarkIcon, History, Search,
  CalendarDays, ChevronRight,
} from "lucide-react";
import Image from "next/image";

// ─── 型 ─────────────────────────────────────────────────────────────

type SubsidyStatus = { status: string };
type MatchingHistoryItem = { createdAt: string; title: string };

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    subsidyStatuses: number;
    bookmarks: number;
    matchingHistories: number;
  };
  subsidyStatuses: SubsidyStatus[];
  matchingHistories: MatchingHistoryItem[];
};

type Stats = {
  totalUsers: number;
  totalGrants: number;
  activeGrants: number;
  totalHistories: number;
};

// ─── コンポーネント ──────────────────────────────────────────────────

export default function AdminPanel() {
  const [tab, setTab] = useState<"users" | "sync">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { users: User[]; stats: Stats };
      setUsers(data.users);
      setStats(data.stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      !search ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  const adoptedCount = (statuses: SubsidyStatus[]) =>
    statuses.filter((s) => s.status === "採択").length;

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            管理者パネル
          </h1>
          <p className="text-gray-500 text-sm mt-1">ユーザー管理・補助金DB同期</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab("users")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "users" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-4 h-4" />ユーザー管理
          </button>
          <button
            onClick={() => setTab("sync")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "sync" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Database className="w-4 h-4" />補助金同期
          </button>
        </div>
      </div>

      {/* ─── 補助金同期タブ ─── */}
      {tab === "sync" && (
        <AdminSync sessionAuth />
      )}

      {/* ─── ユーザー管理タブ ─── */}
      {tab === "users" && (
        <>
          {/* KPI */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "登録ユーザー数", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "DB補助金総数", value: stats.totalGrants.toLocaleString(), icon: Database, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "受付中補助金", value: stats.activeGrants.toLocaleString(), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                { label: "AIマッチング合計", value: stats.totalHistories, icon: Brain, color: "text-orange-600", bg: "bg-orange-50" },
              ].map((kpi) => (
                <Card key={kpi.label} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{kpi.label}</p>
                      <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ユーザー一覧 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  登録ユーザー一覧
                  {!loading && (
                    <Badge variant="outline" className="font-normal text-xs">{filtered.length}件</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="名前・メール検索"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
                    />
                  </div>
                  <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="更新"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />読み込み中...
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500 text-sm">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>{search ? "検索結果がありません" : "登録ユーザーはいません"}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filtered.map((user) => {
                    const lastMatch = user.matchingHistories[0];
                    const adopted = adoptedCount(user.subsidyStatuses);
                    return (
                      <div key={user.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                        {/* アバター */}
                        <div className="flex-shrink-0">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name ?? ""}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase() ?? user.email.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* 名前・メール */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.name ?? "（名前なし）"}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                            <CalendarDays className="w-3 h-3" />
                            登録：{fmtDate(user.createdAt)}
                          </div>
                        </div>

                        {/* 利用状況バッジ */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-0.5">申請</p>
                            <p className="font-bold text-sm text-blue-600">{user._count.subsidyStatuses}</p>
                          </div>
                          {adopted > 0 && (
                            <div className="text-center">
                              <p className="text-xs text-gray-400 mb-0.5">採択</p>
                              <p className="font-bold text-sm text-green-600">{adopted}</p>
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-0.5 justify-center"><BookmarkIcon className="w-2.5 h-2.5" /></p>
                            <p className="font-bold text-sm text-gray-600">{user._count.bookmarks}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-0.5 justify-center"><History className="w-2.5 h-2.5" /></p>
                            <p className="font-bold text-sm text-purple-600">{user._count.matchingHistories}</p>
                          </div>
                        </div>

                        {/* 最終マッチング */}
                        {lastMatch && (
                          <div className="hidden lg:block flex-shrink-0 max-w-[200px]">
                            <p className="text-xs text-gray-400">最終AI検索</p>
                            <p className="text-xs text-gray-600 truncate font-medium">{lastMatch.title}</p>
                            <p className="text-xs text-gray-400">{fmtDate(lastMatch.createdAt)}</p>
                          </div>
                        )}

                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
