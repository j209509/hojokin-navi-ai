"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  TrendingUp, FileText, CheckCircle, Coins, ChevronRight,
  AlertTriangle, RefreshCw, Plus, Bookmark,
} from "lucide-react";

// ─── 型 ────────────────────────────────────────────────────────────

type DashboardStats = {
  totalGrants: number;
  applications: {
    準備中: number;
    申請済: number;
    結果待ち: number;
    採択: number;
    不採択: number;
    total: number;
  };
  totalAdoptedAmount: number;
  upcomingDeadlines: {
    id: string;
    name: string;
    deadline: string | null;
    maxAmount: number;
    url: string | null;
    daysLeft: number;
  }[];
  recentActivities: {
    id: string;
    grantName: string;
    status: string;
    updatedAt: string;
  }[];
};

// ─── 定数 ──────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  採択:     "#22c55e",
  申請済:   "#f97316",
  準備中:   "#3b82f6",
  結果待ち: "#a855f7",
  不採択:   "#94a3b8",
};

const STATUS_ICONS: Record<string, string> = {
  採択:     "🎉",
  申請済:   "📨",
  準備中:   "📝",
  結果待ち: "⏳",
  不採択:   "❌",
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

// ─── コンポーネント ─────────────────────────────────────────────────

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json() as DashboardStats;
        setStats(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { void fetchStats(); }, [fetchStats]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    void fetchStats();
  };

  const userName = session?.user?.name?.split(" ")[0] ?? null;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "おはようございます" :
    hour < 18 ? "こんにちは" : "お疲れさまです";

  const inProgressCount = (stats?.applications.申請済 ?? 0)
    + (stats?.applications.準備中 ?? 0)
    + (stats?.applications.結果待ち ?? 0);

  const kpiData = [
    {
      label:     "登録補助金数",
      value:     loading ? "—" : `${(stats?.totalGrants ?? 0).toLocaleString()}件`,
      change:    "受付中の補助金",
      icon:      FileText,
      textColor: "text-blue-600",
      bgLight:   "bg-blue-50",
    },
    {
      label:     "申請中",
      value:     loading ? "—" : `${inProgressCount}件`,
      change:    stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0
                   ? "締切注意あり" : "進行中の申請",
      icon:      TrendingUp,
      textColor: "text-orange-600",
      bgLight:   "bg-orange-50",
    },
    {
      label:     "採択済",
      value:     loading ? "—" : `${stats?.applications.採択 ?? 0}件`,
      change:    "採択された補助金",
      icon:      CheckCircle,
      textColor: "text-green-600",
      bgLight:   "bg-green-50",
    },
    {
      label:     "獲得金額",
      value:     loading ? "—" : `${(stats?.totalAdoptedAmount ?? 0).toLocaleString()}万円`,
      change:    "採択補助金の合計",
      icon:      Coins,
      textColor: "text-purple-600",
      bgLight:   "bg-purple-50",
    },
  ];

  const pieData = stats
    ? Object.entries(STATUS_COLORS)
        .map(([name, color]) => ({
          name,
          value: stats.applications[name as keyof typeof stats.applications] as number,
          color,
        }))
        .filter((d) => d.value > 0)
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* ── ヘッダー ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード <span className="text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded">✓ 本番DB接続中</span></h1>
          <p className="text-gray-500 text-sm mt-1">
            {greeting}{userName ? `、${userName}様` : ""}。今日も補助金活用を最大化しましょう。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 inline-block" />
            AIマッチング稼働中
          </Badge>
        </div>
      </div>

      {/* ── KPI カード ── */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{kpi.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${kpi.textColor}`}>{kpi.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{kpi.change}</p>
                  </div>
                  <div className={`w-10 h-10 ${kpi.bgLight} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${kpi.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ── 申請状況サマリー ── */}
        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">申請状況サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}件`, ""]} />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center -mt-2">
                  <p className="text-2xl font-bold text-gray-800">{stats?.applications.total}件</p>
                  <p className="text-xs text-gray-400">管理中の補助金</p>
                </div>
              </>
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center text-gray-400">
                <FileText className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium text-gray-500">申請管理中の補助金はありません</p>
                <p className="text-xs mt-1 text-center">補助金DBで気になる案件を<br />申請管理に追加しましょう</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 最近のアクティビティ ── */}
        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">最近のアクティビティ</CardTitle>
            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              すべて見る <ChevronRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent>
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivities.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-lg mt-0.5 flex-shrink-0">
                      {STATUS_ICONS[a.status] ?? "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium line-clamp-1">{a.grantName}</span>
                        を
                        <span
                          className="mx-1 px-1.5 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${STATUS_COLORS[a.status]}20`,
                            color: STATUS_COLORS[a.status],
                          }}
                        >
                          {a.status}
                        </span>
                        に更新しました
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{relativeTime(a.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Bookmark className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm font-medium text-gray-500">まだアクティビティはありません</p>
                <p className="text-xs mt-1">補助金の申請管理を始めると表示されます</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 締切アラート ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <CardTitle className="text-base font-semibold">締切アラート（90日以内）</CardTitle>
          <Badge className="ml-auto text-xs bg-orange-100 text-orange-700 border-orange-200 border">
            {stats?.upcomingDeadlines.length ?? 0}件
          </Badge>
        </CardHeader>
        <CardContent>
          {!stats?.upcomingDeadlines.length ? (
            <p className="text-sm text-gray-400 text-center py-4">
              直近90日以内の締切補助金はありません
            </p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingDeadlines.map((grant) => (
                <div
                  key={grant.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => { if (grant.url) window.open(grant.url, "_blank"); }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        grant.daysLeft <= 14 ? "bg-red-500" : "bg-orange-400"
                      }`}
                    >
                      {grant.daysLeft}日
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 line-clamp-1">{grant.name}</p>
                      <p className="text-xs text-gray-500">
                        締切: {grant.deadline} | 最大{grant.maxAmount.toLocaleString()}万円
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`border flex-shrink-0 ml-2 ${
                      grant.daysLeft <= 14
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }`}
                  >
                    {grant.daysLeft <= 14 ? "⚠️ 要注意" : "注意"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 空状態ガイダンス ── */}
      {!loading && stats && stats.applications.total === 0 && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-blue-800">補助金の申請管理を始めましょう</p>
              <p className="text-sm text-blue-600 mt-1">
                補助金DBで気になる案件を見つけて申請管理に追加できます。
                AIマッチングで自社に最適な補助金を自動提案することもできます。
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Plus className="w-4 h-4 mr-1" />補助金を探す
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
