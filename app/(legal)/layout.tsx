/*
 * app/(legal)/layout.tsx
 * 法的ページ共通レイアウト（ナビゲーション + フッター、CTAなし）
 */

import NavigationBar from "@/components/lp/NavigationBar";
import SiteFooter from "@/components/lp/SiteFooter";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden flex flex-col">
      <NavigationBar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
