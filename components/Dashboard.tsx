"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp, FileText, CheckCircle, Coins, ChevronRight, AlertTriangle } from "lucide-react";

const kpiData = [
  { label: "登録補助金数", value: "127件", change: "+12件（今月）", icon: FileText, color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-50" },
  { label: "申請中", value: "3件", change: "締切注意あり", icon: TrendingUp, color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50" },
  { label: "採択済", value: "2件", change: "今年度採択", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-50" },
  { label: "獲得金額", value: "480万円", change: "累計獲得額", icon: Coins, color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-50" },
];

const pieData = [
  { name: "採択済", value: 2, color: "#22c55e" },
  { name: "申請中", value: 3, color: "#f97316" },
  { name: "準備中", value: 5, color: "#3b82f6" },
  { name: "見送り", value: 2, color: "#94a3b8" },
];

const activities = [
  { type: "info", text: "IT導入補助金2024の申請書類が更新されました", time: "2時間前", icon: "📄" },
  { type: "success", text: "小規模事業者持続化補助金が採択されました", time: "3日前", icon: "✅" },
  { type: "warning", text: "ものづくり補助金の申請締切まで残り7日です", time: "1週間前", icon: "⚠️" },
  { type: "info", text: "新しい補助金「省エネ設備導入支援」が登録されました", time: "1週間前", icon: "🆕" },
  { type: "success", text: "事業再構築補助金（第10回）に採択されました", time: "2週間前", icon: "🎉" },
];

const alerts = [
  { name: "IT導入補助金2024", deadline: "2024年5月31日", daysLeft: 12, amount: "最大450万円" },
  { name: "ものづくり補助金", deadline: "2024年6月7日", daysLeft: 19, amount: "最大1,000万円" },
  { name: "小規模事業者持続化補助金", deadline: "2024年6月12日", daysLeft: 24, amount: "最大200万円" },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-500 text-sm mt-1">おはようございます、山田様。今日も補助金活用を最大化しましょう。</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 inline-block"></span>
            AIマッチング稼働中
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
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
        {/* Pie Chart */}
        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">申請状況サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}件`, ""]} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-2">
              <p className="text-2xl font-bold text-gray-800">12件</p>
              <p className="text-xs text-gray-400">関与補助金合計</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">最近のアクティビティ</CardTitle>
            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              すべて見る <ChevronRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-lg mt-0.5">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Deadline Alerts */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <CardTitle className="text-base font-semibold">締切アラート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${alert.daysLeft <= 14 ? "bg-red-500" : "bg-orange-400"}`}>
                    {alert.daysLeft}日
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{alert.name}</p>
                    <p className="text-xs text-gray-500">締切: {alert.deadline} | {alert.amount}</p>
                  </div>
                </div>
                <Badge className={`${alert.daysLeft <= 14 ? "bg-red-100 text-red-700 border-red-200" : "bg-orange-100 text-orange-700 border-orange-200"} border`}>
                  {alert.daysLeft <= 14 ? "⚠️ 要注意" : "注意"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
