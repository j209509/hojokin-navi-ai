/*
 * SiteFooter.tsx — 全ページ共通フッター
 * Stripe審査対応: 法的必須リンクをすべて掲載
 */

import Link from "next/link";
import { Sparkles, Mail, ExternalLink } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "AIマッチング", href: "/dashboard" },
  { label: "補助金データベース", href: "/dashboard" },
  { label: "申請状況管理", href: "/dashboard" },
  { label: "テンプレートライブラリ", href: "/dashboard" },
  { label: "分析・レポート", href: "/dashboard" },
];

const LEGAL_LINKS = [
  { label: "利用規約", href: "/terms" },
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "特定商取引法に基づく表記", href: "/tokushoho" },
  { label: "お問い合わせ", href: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "ご利用ガイド", href: "/dashboard" },
  { label: "料金プラン", href: "/#pricing" },
  { label: "よくある質問", href: "/#faq" },
  { label: "jGrants（外部）", href: "https://jgrants.go.jp/", external: true },
];

/* ─── スリム版（ダッシュボード内など狭い場所向け） ─── */
export function SlimFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 flex-shrink-0">
      <p>© {new Date().getFullYear()} 補助金ナビAI. All rights reserved.</p>
      <div className="flex items-center gap-4 flex-wrap">
        {LEGAL_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="hover:text-gray-600 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

/* ─── フル版（LP・法的ページ向け） ─── */
export default function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ブランド */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="font-bold text-white">補助金ナビAI</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              中小企業・個人事業主の補助金獲得を、
              AIの力で最速サポートするクラウドサービスです。
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Mail className="w-3.5 h-3.5" />
              <a href="mailto:support@hojokin-navi-ai.com" className="hover:text-gray-300 transition-colors">
                support@hojokin-navi-ai.com
              </a>
            </div>
            <p className="text-xs text-gray-600">全国2,800件以上の補助金データベース</p>
          </div>

          {/* プロダクト */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">プロダクト</h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* リソース */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">リソース</h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.label}>
                  {"external" in l && l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-white transition-colors flex items-center gap-1"
                    >
                      {l.label}
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">法的情報・サポート</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-xs text-gray-500 leading-relaxed">
                本サービスは補助金の採択・受給を保証するものではありません。
                申請は必ず公募要領をご確認の上、ご自身の責任で行ってください。
              </p>
            </div>
          </div>
        </div>

        {/* ボトム */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              © {new Date().getFullYear()} 補助金ナビAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {LEGAL_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-700 text-center mt-4">
            Powered by Claude AI (Anthropic) · Secured by SSL · Payments by Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
