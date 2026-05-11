"use client";

import Link from "next/link";
import { PageType } from "@/app/dashboard/page";
import {
  LayoutDashboard,
  Sparkles,
  Database,
  FileText,
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: "dashboard" as PageType, label: "ダッシュボード", icon: LayoutDashboard },
  { id: "matching" as PageType, label: "AIマッチング", icon: Sparkles, badge: "NEW" },
  { id: "database" as PageType, label: "補助金DB", icon: Database },
  { id: "applications" as PageType, label: "申請管理", icon: FileText, badge: "3" },
  { id: "templates" as PageType, label: "テンプレート", icon: BookOpen },
  { id: "analytics" as PageType, label: "分析・設定", icon: BarChart3 },
];

export default function Sidebar({
  currentPage,
  onPageChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 z-50 flex flex-col ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        {isOpen ? (
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <p className="font-bold text-sm">補助金ナビAI</p>
              <p className="text-xs text-blue-300">スタータープラン</p>
            </div>
          </Link>
        ) : (
          <Link href="/" className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity mx-auto">
            <Sparkles className="w-5 h-5 text-blue-900" />
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-blue-700 transition-colors ml-auto"
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 mt-2">
        {/* トップページへ戻る */}
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-700 text-blue-300 transition-all duration-200 group"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="text-sm flex-1 text-left">トップページ</span>
          )}
        </Link>

        <div className={`${isOpen ? "mx-3 my-1" : "mx-2 my-1"} border-t border-blue-700/60`} />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-yellow-400 text-blue-900 font-semibold shadow-lg"
                  : "hover:bg-blue-700 text-blue-100"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-900" : ""}`}
              />
              {isOpen && (
                <span className="text-sm flex-1 text-left">{item.label}</span>
              )}
              {isOpen && item.badge && (
                <Badge
                  className={`text-xs px-1.5 py-0 ${
                    isActive
                      ? "bg-blue-900 text-yellow-400"
                      : "bg-yellow-400 text-blue-900"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-blue-700 space-y-1">
        {[
          { icon: Bell, label: "通知" },
          { icon: Settings, label: "設定" },
          { icon: LogOut, label: "ログアウト" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-200 transition-colors"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span className="text-sm">{label}</span>}
          </button>
        ))}
        {isOpen && (
          <div className="mt-2 px-3 py-2 bg-blue-700/50 rounded-lg">
            <p className="text-xs text-blue-300">ログイン中</p>
            <p className="text-sm font-medium">山田 太郎</p>
            <p className="text-xs text-blue-300">株式会社サンプル</p>
          </div>
        )}
      </div>
    </aside>
  );
}
