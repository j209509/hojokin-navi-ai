import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma + pg を Node.js ランタイムで処理（Webpackバンドルから除外）
  serverExternalPackages: ["@prisma/client", "prisma", "pg", "@prisma/adapter-pg"],

  // Google プロフィール画像など外部ドメインを許可
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google アカウント画像
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", // Google 全般
      },
    ],
  },
};

export default nextConfig;
