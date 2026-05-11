"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, Calendar, Clock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const applications = [
  {
    id: 1,
    name: "IT導入補助金2024",
    status: "申請済",
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    progress: 80,
    deadline: "2024/05/31",
    daysLeft: 12,
    amount: "最大450万円",
    submittedDate: "2024/05/01",
    documents: [
      { name: "事業計画書", done: true },
      { name: "履歴事項全部証明書", done: true },
      { name: "税務申告書（直近2期分）", done: true },
      { name: "IT導入支援事業者との契約書", done: true },
      { name: "導入するITツールの詳細説明書", done: false },
    ],
  },
  {
    id: 2,
    name: "小規模事業者持続化補助金",
    status: "準備中",
    statusColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    progress: 45,
    deadline: "2024/06/12",
    daysLeft: 24,
    amount: "最大200万円",
    submittedDate: null,
    documents: [
      { name: "経営計画書", done: true },
      { name: "補助事業計画書", done: true },
      { name: "事業支援計画書（商工会議所発行）", done: false },
      { name: "確定申告書（直近1期分）", done: false },
      { name: "見積書（必要経費）", done: false },
    ],
  },
  {
    id: 3,
    name: "ものづくり補助金",
    status: "結果待ち",
    statusColor: "bg-purple-100 text-purple-700 border-purple-200",
    progress: 100,
    deadline: "2024/06/07",
    daysLeft: 19,
    amount: "最大1,000万円",
    submittedDate: "2024/04/20",
    documents: [
      { name: "事業計画書", done: true },
      { name: "賃金引上げ計画の表明書", done: true },
      { name: "決算書（直近2期分）", done: true },
      { name: "登記事項証明書", done: true },
      { name: "認定支援機関の確認書", done: true },
    ],
  },
];

const calendarData = [
  { date: "5/31", name: "IT導入補助金", color: "bg-red-400", urgent: true },
  { date: "6/7", name: "ものづくり補助金", color: "bg-purple-400", urgent: false },
  { date: "6/12", name: "持続化補助金", color: "bg-orange-400", urgent: false },
  { date: "7/31", name: "事業再構築補助金", color: "bg-blue-400", urgent: false },
];

export default function ApplicationManager() {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (appId: number, docName: string) => {
    const key = `${appId}-${docName}`;
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">申請状況管理</h1>
        <p className="text-gray-500 text-sm mt-1">申請中の補助金の進捗状況を管理します</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { status: "準備中", count: 1, color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-700" },
          { status: "申請済", count: 1, color: "bg-blue-50 border-blue-200", textColor: "text-blue-700" },
          { status: "結果待ち", count: 1, color: "bg-purple-50 border-purple-200", textColor: "text-purple-700" },
        ].map((item) => (
          <div key={item.status} className={`${item.color} border rounded-xl p-4 text-center`}>
            <p className={`text-sm font-medium ${item.textColor}`}>{item.status}</p>
            <p className={`text-3xl font-bold ${item.textColor} mt-1`}>{item.count}件</p>
          </div>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {applications.map((app) => {
          const isExpanded = expandedId === app.id;
          return (
            <Card key={app.id} className="border-0 shadow-sm overflow-hidden">
              <div className="cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        <Badge className={`${app.statusColor} border text-xs`}>{app.status}</Badge>
                        {app.daysLeft <= 14 && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> 締切注意
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />締切: {app.deadline}</span>
                        <span className="font-medium text-orange-600">残り{app.daysLeft}日</span>
                        <span>{app.amount}</span>
                        {app.submittedDate && <span>申請日: {app.submittedDate}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">進捗</p>
                        <p className="text-sm font-bold text-blue-600">{app.progress}%</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                </CardContent>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">必要書類チェックリスト</h4>
                  <div className="space-y-2">
                    {app.documents.map((doc) => {
                      const key = `${app.id}-${doc.name}`;
                      const isChecked = checkedDocs[key] !== undefined ? checkedDocs[key] : doc.done;
                      return (
                        <div key={doc.name} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleDoc(app.id, doc.name)}>
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${isChecked ? "line-through text-gray-400" : "text-gray-700"}`}>{doc.name}</span>
                          {isChecked && <Badge className="ml-auto text-xs bg-green-100 text-green-700">完了</Badge>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">書類を追加</Button>
                    {app.status === "準備中" && <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">申請書類を提出</Button>}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Calendar */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-base font-semibold">締切カレンダー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {calendarData.map((item) => (
              <div key={item.date} className={`${item.urgent ? "ring-2 ring-red-400 ring-offset-1" : ""} bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors cursor-pointer`}>
                <p className="text-lg font-bold text-gray-800">{item.date}</p>
                <div className={`${item.color} rounded-full h-1 my-2`} />
                <p className="text-xs text-gray-600 line-clamp-2">{item.name}</p>
                {item.urgent && <p className="text-xs text-red-500 font-medium mt-1">⚠️ 要注意</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
