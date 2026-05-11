"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import AIMatching from "@/components/AIMatching";
import SubsidyDatabase from "@/components/SubsidyDatabase";
import ApplicationManager from "@/components/ApplicationManager";
import TemplateLibrary from "@/components/TemplateLibrary";
import Analytics from "@/components/Analytics";

export type PageType = "dashboard" | "matching" | "database" | "applications" | "templates" | "analytics";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "matching": return <AIMatching />;
      case "database": return <SubsidyDatabase />;
      case "applications": return <ApplicationManager />;
      case "templates": return <TemplateLibrary />;
      case "analytics": return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {renderPage()}
      </main>
    </div>
  );
}
