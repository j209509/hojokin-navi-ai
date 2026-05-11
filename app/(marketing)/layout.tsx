/*
 * app/(marketing)/layout.tsx
 * ─────────────────────────────────────────────────────────────
 * LP専用レイアウト（ナビゲーション・フッター）
 *
 * このレイアウトは app/(marketing)/ 配下のすべてのページに適用されます。
 * 現在はマーケティングページが app/page.tsx にあるため、
 * このレイアウトはランディングページ以外のマーケティングページ
 * （例: /about, /contact, /pricing 等）を追加する際に使用してください。
 *
 * 使用例:
 *   app/(marketing)/about/page.tsx   → /about
 *   app/(marketing)/contact/page.tsx → /contact
 */

import NavigationBar from "@/components/lp/NavigationBar";
import FooterCTA from "@/components/lp/FooterCTA";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <NavigationBar />
      <main>{children}</main>
      <FooterCTA />
    </div>
  );
}
