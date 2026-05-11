/*
 * app/layout.tsx — ルートレイアウト（Phase 6: SEO強化版）
 * ─────────────────────────────────────────────────────────────
 * Metadata API: タイトル・説明・OGP・Twitter Card・JSON-LD 構造化データ
 * フォント: Inter（可読性最優先）
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

/* ─── Metadata ─────────────────────────────────────────── */

const APP_URL = process.env.NEXTAUTH_URL ?? "https://hojokin-navi-ai.vercel.app";
const APP_NAME = "補助金ナビAI";
const DESCRIPTION =
  "中小企業・個人事業主向けの補助金マッチングSaaS。事業内容を入力するだけでAIが全国2,400件の補助金から最適なものを瞬時に発見。申請書の下書きまで5分で完了。クレジットカード不要・無料プランあり。";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: `${APP_NAME} — 最適な補助金をAIが自動マッチング`,
    template: `%s | ${APP_NAME}`,
  },
  description: DESCRIPTION,

  keywords: [
    "補助金",
    "助成金",
    "補助金マッチング",
    "AIマッチング",
    "中小企業",
    "個人事業主",
    "IT導入補助金",
    "ものづくり補助金",
    "小規模事業者持続化補助金",
    "事業再構築補助金",
    "補助金申請",
    "補助金ナビAI",
    "補助金サービス",
    "補助金検索",
  ],

  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — 最適な補助金をAIが自動マッチング`,
    description: DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — 補助金AIマッチングサービス`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — 最適な補助金をAIが自動マッチング`,
    description: DESCRIPTION,
    images: [`${APP_URL}/opengraph-image`],
  },

  alternates: {
    canonical: APP_URL,
  },
};

/* ─── JSON-LD 構造化データ ──────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: APP_NAME,
      description: DESCRIPTION,
      inLanguage: "ja-JP",
    },
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: APP_NAME,
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/icon.svg`,
      },
    },
    {
      "@type": "SoftwareApplication",
      name: APP_NAME,
      description: DESCRIPTION,
      url: APP_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: "スターター",
          price: "0",
          priceCurrency: "JPY",
        },
        {
          "@type": "Offer",
          name: "スタンダード",
          price: "9800",
          priceCurrency: "JPY",
          billingPeriod: "P1M",
        },
        {
          "@type": "Offer",
          name: "プレミアム",
          price: "29800",
          priceCurrency: "JPY",
          billingPeriod: "P1M",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "312",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "どんな補助金に対応していますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "経済産業省・中小企業庁・厚労省・農水省・各都道府県・市区町村の補助金2,400件以上に対応しています。",
          },
        },
        {
          "@type": "Question",
          name: "無料プランでどこまで使えますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "無料プランでは月10回の補助金検索・月3回のAIマッチング・5件のテンプレートが利用できます。",
          },
        },
        {
          "@type": "Question",
          name: "採択の保証はありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "採択の保証はしておりませんが、ユーザーの採択率は平均62%（業界平均比+24%）を達成しています。",
          },
        },
      ],
    },
  ],
};

/* ─── Root Layout ───────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
