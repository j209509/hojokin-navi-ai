"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User, Bell, CreditCard, Save, Check, RefreshCw } from "lucide-react";
import type { Session } from "next-auth";

// ─── 型 ────────────────────────────────────────────────────────────

type UserProfile = {
  companyName?: string | null;
  industry?: string | null;
  employeeCount?: string | null;
  annualRevenue?: string | null;
  prefecture?: string | null;
  budget?: string | null;
};

type DashboardStats = {
  applications: {
    準備中: number; 申請済: number; 結果待ち: number; 採択: number; 不採択: number; total: number;
  };
  totalAdoptedAmount: number;
};

type SettingsTab = "profile" | "plan" | "notifications";

// ─── 定数 ──────────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "製造業", "小売業", "飲食業", "IT・通信業", "建設業",
  "サービス業", "医療・福祉", "不動産業", "農業・林業", "運輸業", "その他",
];
const EMPLOYEE_OPTIONS = [
  "1〜5名", "6〜10名", "11〜20名", "21〜50名",
  "51〜100名", "101〜300名", "301名以上",
];
const REVENUE_OPTIONS = [
  "〜1,000万円", "1,000〜3,000万円", "3,000万円〜1億円", "1〜5億円", "5億円以上",
];
const BUDGET_OPTIONS = [
  "〜50万円", "50〜100万円", "100〜300万円", "300万円以上",
];

const PREFECTURE_LIST = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const PLANS = [
  {
    name: "スターター",
    price: "¥0/月",
    features: ["補助金検索（月10回）", "AIマッチング（月3回）", "テンプレート5件"],
    current: true,
  },
  {
    name: "スタンダード",
    price: "¥9,800/月",
    features: ["補助金検索（無制限）", "AIマッチング（無制限）", "テンプレート全件", "申請管理ツール"],
    current: false,
  },
  {
    name: "プレミアム",
    price: "¥29,800/月",
    features: ["全機能利用可能", "専任コンサルタント", "申請書類レビュー", "優先サポート"],
    current: false,
  },
];

// ─── コンポーネント ─────────────────────────────────────────────────

export default function Analytics({ session }: { session?: Session | null }) {
  const user = session?.user;

  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // プロフィール
  const [profile, setProfile] = useState<UserProfile>({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");

  // 通知設定（ローカル状態）
  const [notifications, setNotifications] = useState({
    deadline: true,
    newSubsidy: true,
    result: true,
    email: false,
    line: false,
  });

  // 分析データ
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // プロフィール取得
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json() as { profile: UserProfile | null };
        if (data.profile) setProfile(data.profile);
      }
    } catch { /* ignore */ }
    finally { setProfileLoading(false); }
  }, []);

  // 統計取得
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json() as DashboardStats;
        setStats(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    void fetchProfile();
    void fetchStats();
  }, [fetchProfile, fetchStats]);

  // プロフィール保存
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  // 分析用グラフデータ（ステータス別件数）
  const barData = stats
    ? [
        { label: "準備中",   value: stats.applications.準備中,   fill: "#3b82f6" },
        { label: "申請済",   value: stats.applications.申請済,   fill: "#f97316" },
        { label: "結果待ち", value: stats.applications.結果待ち, fill: "#a855f7" },
        { label: "採択",     value: stats.applications.採択,     fill: "#22c55e" },
        { label: "不採択",   value: stats.applications.不採択,   fill: "#94a3b8" },
      ]
    : [];

  const adoptionRate = stats && stats.applications.total > 0
    ? Math.round((stats.applications.採択 / stats.applications.total) * 100)
    : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分析・設定</h1>
        <p className="text-gray-500 text-sm mt-1">補助金活用の分析とアカウント設定</p>
      </div>

      {/* ── 統計サマリー ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "総申請数",  value: stats ? `${stats.applications.total}件` : "—" },
          { label: "採択数",    value: stats ? `${stats.applications.採択}件` : "—",   sub: adoptionRate !== null ? `採択率 ${adoptionRate}%` : undefined },
          { label: "総獲得金額", value: stats ? `${stats.totalAdoptedAmount.toLocaleString()}万円` : "—" },
          { label: "平均採択率", value: adoptionRate !== null ? `${adoptionRate}%` : "データ不足" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-blue-600 mt-1">{stat.value}</p>
              {stat.sub && <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── 申請ステータス分布 ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">申請ステータス分布</CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length > 0 && stats && stats.applications.total > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v}件`, ""]} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-gray-400">
              <p className="text-sm font-medium text-gray-500">申請データがありません</p>
              <p className="text-xs mt-1">申請管理に補助金を追加するとグラフが表示されます</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 設定 ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">設定</CardTitle>
        </CardHeader>
        <CardContent>
          {/* タブ */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            {([
              { id: "profile"       as SettingsTab, label: "プロフィール", icon: User       },
              { id: "plan"          as SettingsTab, label: "プラン選択",   icon: CreditCard },
              { id: "notifications" as SettingsTab, label: "通知設定",     icon: Bell       },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSettingsTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  settingsTab === id ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          {/* ─ プロフィール ─ */}
          {settingsTab === "profile" && (
            <div className="max-w-md space-y-4">
              {profileLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin" />読み込み中...
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-sm">名前</Label>
                    <Input
                      className="mt-1"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例: 山田 太郎"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">メールアドレス</Label>
                    <Input className="mt-1" type="email" value={email} disabled />
                    <p className="text-xs text-gray-400 mt-1">認証メールアドレスは変更できません</p>
                  </div>
                  <div>
                    <Label className="text-sm">会社名</Label>
                    <Input
                      className="mt-1"
                      value={profile.companyName ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, companyName: e.target.value }))}
                      placeholder="例: 株式会社○○"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">業種</Label>
                    <Select
                      value={profile.industry ?? ""}
                      onValueChange={(v) => setProfile((p) => ({ ...p, industry: v }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="業種を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">従業員数</Label>
                    <Select
                      value={profile.employeeCount ?? ""}
                      onValueChange={(v) => setProfile((p) => ({ ...p, employeeCount: v }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="従業員数を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYEE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">年間売上</Label>
                    <Select
                      value={profile.annualRevenue ?? ""}
                      onValueChange={(v) => setProfile((p) => ({ ...p, annualRevenue: v }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="年間売上を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVENUE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">都道府県</Label>
                    <Select
                      value={profile.prefecture ?? ""}
                      onValueChange={(v) => setProfile((p) => ({ ...p, prefecture: v }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="都道府県を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFECTURE_LIST.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">補助金の予算感</Label>
                    <Select
                      value={profile.budget ?? ""}
                      onValueChange={(v) => setProfile((p) => ({ ...p, budget: v }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="予算感を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={saving}
                  >
                    {saving
                      ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />保存中...</>
                      : saved
                        ? <><Check className="w-4 h-4 mr-2" />保存しました</>
                        : <><Save className="w-4 h-4 mr-2" />変更を保存</>}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* ─ プラン ─ */}
          {settingsTab === "plan" && (
            <div className="grid grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl p-5 border-2 transition-all ${
                    plan.current
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    {plan.current && (
                      <Badge className="bg-blue-600 text-white text-xs">現在</Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold text-blue-600 mb-4">{plan.price}</p>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.current ? "outline" : "default"}
                    size="sm"
                    className={`w-full ${!plan.current ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    disabled={plan.current}
                  >
                    {plan.current ? "現在のプラン" : "アップグレード"}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* ─ 通知設定 ─ */}
          {settingsTab === "notifications" && (
            <div className="max-w-md space-y-4">
              <h3 className="font-medium text-gray-800">通知の種類</h3>
              {[
                { key: "deadline"   as const, label: "締切アラート",  desc: "申請締切が近づいた際に通知" },
                { key: "newSubsidy" as const, label: "新着補助金",    desc: "新しい補助金が登録された際に通知" },
                { key: "result"     as const, label: "採否結果",      desc: "採択・不採択の結果が発表された際に通知" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                      notifications[item.key] ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications[item.key] ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              ))}

              <h3 className="font-medium text-gray-800 pt-2">通知チャンネル</h3>
              {[
                { key: "email" as const, label: "メール通知", desc: "登録メールアドレスに送信" },
                { key: "line"  as const, label: "LINE通知",   desc: "LINEビジネスアカウントに送信（近日対応予定）" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                      notifications[item.key] ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications[item.key] ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              ))}
              <Button
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saved
                  ? <><Check className="w-4 h-4 mr-2" />保存しました</>
                  : <><Save className="w-4 h-4 mr-2" />設定を保存</>}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
