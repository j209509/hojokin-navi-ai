"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import AIMatching from "@/components/AIMatching";
import SubsidyDatabase from "@/components/SubsidyDatabase";
import ApplicationManager from "@/components/ApplicationManager";
import TemplateLibrary from "@/components/TemplateLibrary";
import Analytics from "@/components/Analytics";

export type PageType =
  | "dashboard"
  | "matching"
  | "database"
  | "applications"
  | "templates"
  | "analytics";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 未認証の場合はサインインページへ（ミドルウェアのバックアップ）
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  // ローディング中
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-300" />
          <p className="text-blue-300 text-sm">認証情報を確認中...</p>
        </div>
      </div>
    );
  }

  // 未認証（リダイレクト中）
  if (status === "unauthenticated") {
    return null;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":    return <Dashboard />;
      case "matching":     return <AIMatching />;
      case "database":     return <SubsidyDatabase />;
      case "applications": return <ApplicationManager />;
      case "templates":    return <TemplateLibrary />;
      case "analytics":    return <Analytics session={session} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        session={session}
      />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {renderPage()}
      </main>
    </div>
  );
}
