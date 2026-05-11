"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  RefreshCw, Database, Wifi, CheckCircle2, XCircle,
  AlertTriangle, Info, Play, Clock, Shield, ShieldCheck,
} from "lucide-react";

// ─── 型 ────────────────────────────────────────────────────────────

type SyncEvent =
  | { type: "start";    message: string }
  | { type: "info";     message: string; totalCount?: number }
  | { type: "progress"; current: number; total: number; message?: string }
  | { type: "warning";  message: string }
  | { type: "error";    message: string }
  | { type: "complete"; upserted: number; failed: number; total: number; message: string; syncedAt?: string };

type SyncStatus = {
  totalGrants: number;
  lastSyncedAt: string | null;
  mockGrantsCount: number;
  status: "ready" | "db_not_connected";
  message?: string;
};

// ─── コンポーネント ─────────────────────────────────────────────────

export default function AdminSync() {
  const [adminSecret, setAdminSecret] = useState("");
  const [syncing, setSyncing]         = useState(false);
  const [logs, setLogs]               = useState<SyncEvent[]>([]);
  const [progress, setProgress]       = useState<{ current: number; total: number } | null>(null);
  const [status, setStatus]           = useState<SyncStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  // ステータス取得
  const fetchStatus = async () => {
    if (!adminSecret) return;
    setStatusLoading(true);
    try {
      const res = await fetch("/api/admin/sync", {
        headers: { Authorization: `Bearer ${adminSecret}` },
      });
      if (res.ok) {
        const data = await res.json() as SyncStatus;
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (logs.length > 0) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (event: SyncEvent) => {
    setLogs((p) => [...p, event]);
    if (event.type === "progress") {
      setProgress({ current: event.current, total: event.total });
    }
  };

  const startSync = async (mode: "active" | "full" | "mhlw" | "test") => {
    if (!adminSecret) {
      alert("ADMIN_SECRET を入力してください");
      return;
    }

    setSyncing(true);
    setLogs([]);
    setProgress(null);
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/admin/sync?mode=${mode}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminSecret}` },
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        addLog({ type: "error", message: `HTTP ${res.status}: 認証に失敗しました。ADMIN_SECRETを確認してください。` });
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6)) as SyncEvent;
              addLog(event);
            } catch {
              // skip
            }
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        addLog({ type: "error", message: `接続エラー: ${(e as Error).message}` });
      }
    } finally {
      setSyncing(false);
      void fetchStatus();
    }
  };

  const stopSync = () => {
    abortRef.current?.abort();
    setSyncing(false);
  };

  const lastEvent = logs[logs.length - 1];
  const progressPct = progress
    ? Math.round((progress.current / Math.max(progress.total, 1)) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          管理者パネル — jGrants同期
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          jGrants APIから最新の補助金データを取得してDBに同期します。
          毎週月曜 12:00(JST) に自動実行されます。
        </p>
      </div>

      {/* Auth */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">認証</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="ADMIN_SECRET を入力"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="max-w-xs"
              onKeyDown={(e) => { if (e.key === "Enter") void fetchStatus(); }}
            />
            <Button variant="outline" onClick={fetchStatus} disabled={!adminSecret || statusLoading}>
              {statusLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "ステータス確認"}
            </Button>
          </div>

          {/* Status Info */}
          {status && (
            <div className={`rounded-lg p-3 text-sm space-y-1 ${
              status.status === "ready" ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
            }`}>
              <div className="flex items-center gap-2 font-medium">
                {status.status === "ready"
                  ? <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-green-700">DB接続済み</span></>
                  : <><AlertTriangle className="w-4 h-4 text-orange-600" /><span className="text-orange-700">DB未接続</span></>}
              </div>
              <div className="text-gray-600 space-y-0.5 pl-6">
                <p>DB登録件数: <strong>{status.totalGrants.toLocaleString()}件</strong></p>
                <p>モックデータ: {status.mockGrantsCount}件</p>
                {status.lastSyncedAt && (
                  <p className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    最終同期: {new Date(status.lastSyncedAt).toLocaleString("ja-JP")}
                  </p>
                )}
                {status.message && <p className="text-orange-700">{status.message}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">同期実行</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* 受付中のみ */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-700">受付中のみ（高速）</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                jGrants APIから<strong>現在受付中</strong>の補助金のみ取得。約250件・2分以内。
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => void startSync("active")}
                disabled={syncing || !adminSecret}
              >
                {syncing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                {syncing ? "同期中..." : "同期開始"}
              </Button>
            </div>

            {/* 全件同期 */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm text-purple-700">全件 + 厚労省（低速）</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                jGrants<strong>締切済み含む全2,000件超</strong> + 厚労省助成金30件を取得。5分程度かかる。
              </p>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => void startSync("full")}
                disabled={syncing || !adminSecret}
              >
                <Play className="w-4 h-4 mr-2" />
                全件同期
              </Button>
            </div>

            {/* 厚労省のみ */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-green-700">厚労省のみ</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                キャリアアップ・人材開発・雇用調整など<strong>雇用系助成金約30件</strong>を追加取得。
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => void startSync("mhlw")}
                disabled={syncing || !adminSecret}
              >
                <Play className="w-4 h-4 mr-2" />
                厚労省同期
              </Button>
            </div>

            {/* テスト */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm text-gray-600">テスト実行</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                モックデータで動作確認のみ（DBへの書き込みなし）。
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => void startSync("test")}
                disabled={syncing || !adminSecret}
              >
                <Play className="w-4 h-4 mr-2" />
                テスト実行
              </Button>
            </div>
          </div>

          {syncing && (
            <Button variant="outline" size="sm" onClick={stopSync} className="text-red-600 border-red-200 hover:bg-red-50">
              <XCircle className="w-4 h-4 mr-2" />
              中断
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Progress + Logs */}
      {logs.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">実行ログ</CardTitle>
            {lastEvent?.type === "complete" && (
              <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />完了
              </Badge>
            )}
            {lastEvent?.type === "error" && (
              <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs">
                <XCircle className="w-3 h-3 mr-1" />エラー
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Progress Bar */}
            {progress && progress.total > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{progress.current} / {progress.total} 件</span>
                  <span>{progressPct}%</span>
                </div>
                <Progress value={progressPct} className="h-2" />
              </div>
            )}

            {/* Log Lines */}
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-80 overflow-y-auto">
              {logs.map((log, i) => (
                <LogLine key={i} event={log} />
              ))}
              {syncing && (
                <span className="text-gray-400 animate-pulse">▍</span>
              )}
              <div ref={logsEndRef} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cron Info */}
      <Card className="border-0 shadow-sm bg-indigo-50 border border-indigo-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-indigo-800 mb-1">自動同期スケジュール</p>
              <p className="text-indigo-700">
                <strong>毎週月曜 03:00 UTC（= 12:00 JST）</strong> に自動実行されます。
              </p>
              <p className="text-indigo-600 text-xs mt-1">
                設定: <code className="bg-indigo-100 px-1 rounded">vercel.json</code> の crons セクション。
                Vercel ダッシュボードで <code className="bg-indigo-100 px-1 rounded">CRON_SECRET</code> 環境変数の設定が必要です。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── ログ1行 ────────────────────────────────────────────────────────

function LogLine({ event }: { event: SyncEvent }) {
  const ts = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const config = {
    start:    { color: "text-blue-400",   icon: <Info className="w-3 h-3" /> },
    info:     { color: "text-cyan-400",   icon: <Info className="w-3 h-3" /> },
    progress: { color: "text-yellow-300", icon: <RefreshCw className="w-3 h-3" /> },
    warning:  { color: "text-orange-400", icon: <AlertTriangle className="w-3 h-3" /> },
    error:    { color: "text-red-400",    icon: <XCircle className="w-3 h-3" /> },
    complete: { color: "text-green-400",  icon: <CheckCircle2 className="w-3 h-3" /> },
  }[event.type];

  const text =
    event.type === "progress"
      ? (event.message ?? `進捗: ${event.current}/${event.total}件`)
      : event.message;

  return (
    <div className={`flex items-start gap-2 ${config.color}`}>
      <span className="text-gray-500 flex-shrink-0 w-20">{ts}</span>
      <span className="flex-shrink-0 mt-0.5">{config.icon}</span>
      <span className="break-all">{text}</span>
      {event.type === "complete" && (
        <span className="text-green-300 ml-1">
          ({event.upserted}件保存 / {event.failed}件失敗)
        </span>
      )}
    </div>
  );
}
