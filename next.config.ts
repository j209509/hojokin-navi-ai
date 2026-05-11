import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma + pg を Node.js ランタイムで処理（Webpackバンドルから除外）
  serverExternalPackages: ["@prisma/client", "prisma", "pg", "@prisma/adapter-pg"],
};

export default nextConfig;
