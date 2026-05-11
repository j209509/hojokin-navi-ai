"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User, Bell, CreditCard, Save, Check } from "lucide-react";
import type { Session } from "next-auth";

const adoptionData = [
  { month: "2023/10", rate: 42 },
  { month: "2023/11", rate: 38 },
  { month: "2023/12", rate: 55 },
  { month: "2024/01", rate: 48 },
  { month: "2024/02", rate: 62 },
  { month: "2024/03", rate: 71 },
  { month: "2024/04", rate: 68 },
];

const amountData = [
  { month: "10月", amount: 0 },
  { month: "11月", amount: 0 },
  { month: "12月", amount: 120 },
  { month: "1月", amount: 0 },
  { month: "2月", amount: 0 },
  { month: "3月", amount: 360 },
  { month: "4月", amount: 0 },
];

const plans = [
  { name: "スターター", price: "¥0/月", features: ["補助金検索（月10回）", "AIマッチング（月3回）", "テンプレート5件"], current: true },
  { name: "スタンダード", price: "¥9,800/月", features: ["補助金検索（無制限）", "AIマッチング（無制限）", "テンプレート全件", "申請管理ツール"], current: false },
  { name: "プレミアム", price: "¥29,800/月", features: ["全機能利用可能", "専任コンサルタント", "申請書類レビュー", "優先サポート"], current: false },
];

type SettingsTab = "profile" | "plan" | "notifications";

export default function Analytics({ session }: { session?: Session | null }) {
  const user = session?.user;
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    deadline: true,
    newSubsidy: true,
    result: true,
    email: false,
    line: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分析・設定</h1>
        <p className="text-gray-500 text-sm mt-1">補助金活用の分析とアカウント設定</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">採択率推移</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={adoptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${v}%`, "採択率"]} />
                <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">獲得金額（月別）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={amountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="万" />
                <Tooltip formatter={(v) => [`${v}万円`, "獲得金額"]} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "総申請数", value: "12件" },
          { label: "採択数", value: "8件", sub: "採択率 66.7%" },
          { label: "総獲得金額", value: "480万円" },
          { label: "平均採択率", value: "58.3%" },
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

      {/* Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            {([
              { id: "profile" as SettingsTab, label: "プロフィール", icon: User },
              { id: "plan" as SettingsTab, label: "プラン選択", icon: CreditCard },
              { id: "notifications" as SettingsTab, label: "通知設定", icon: Bell },
            ]).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setSettingsTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${settingsTab === id ? "bg-white text-blue-700 shadow-sm" : "text-gray-600"}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {settingsTab === "profile" && (
            <div className="max-w-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-sm">姓</Label><Input className="mt-1" defaultValue={user?.name?.split(" ")[0] ?? "山田"} /></div>
                <div><Label className="text-sm">名</Label><Input className="mt-1" defaultValue={user?.name?.split(" ")[1] ?? "太郎"} /></div>
              </div>
              <div><Label className="text-sm">会社名</Label><Input className="mt-1" defaultValue="株式会社サンプル" /></div>
              <div><Label className="text-sm">メールアドレス</Label><Input className="mt-1" type="email" defaultValue={user?.email ?? "yamada@sample.co.jp"} /></div>
              <div><Label className="text-sm">電話番号</Label><Input className="mt-1" defaultValue="03-1234-5678" /></div>
              <div><Label className="text-sm">業種</Label><Input className="mt-1" defaultValue="IT・通信業" /></div>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                {saved ? <><Check className="w-4 h-4 mr-2" />保存しました</> : <><Save className="w-4 h-4 mr-2" />変更を保存</>}
              </Button>
            </div>
          )}

          {settingsTab === "plan" && (
            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.name} className={`rounded-xl p-5 border-2 transition-all ${plan.current ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    {plan.current && <Badge className="bg-blue-600 text-white text-xs">現在</Badge>}
                  </div>
                  <p className="text-xl font-bold text-blue-600 mb-4">{plan.price}</p>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.current ? "outline" : "default"} size="sm" className={`w-full ${!plan.current ? "bg-blue-600 hover:bg-blue-700" : ""}`} disabled={plan.current}>
                    {plan.current ? "現在のプラン" : "アップグレード"}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {settingsTab === "notifications" && (
            <div className="max-w-md space-y-4">
              <h3 className="font-medium text-gray-800">通知の種類</h3>
              {[
                { key: "deadline" as const, label: "締切アラート", desc: "申請締切が近づいた際に通知" },
                { key: "newSubsidy" as const, label: "新着補助金", desc: "新しい補助金が登録された際に通知" },
                { key: "result" as const, label: "採否結果", desc: "採択・不採択の結果が発表された際に通知" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key] ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
              <h3 className="font-medium text-gray-800 pt-2">通知チャンネル</h3>
              {[
                { key: "email" as const, label: "メール通知", desc: "登録メールアドレスに送信" },
                { key: "line" as const, label: "LINE通知", desc: "LINEビジネスアカウントに送信" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key] ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                {saved ? <><Check className="w-4 h-4 mr-2" />保存しました</> : <><Save className="w-4 h-4 mr-2" />設定を保存</>}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
