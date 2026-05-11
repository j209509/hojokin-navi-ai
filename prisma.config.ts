import { defineConfig } from "prisma/config";
import * as path from "path";
import * as fs from "fs";

// Prisma CLI は .env.local を読まないので手動でロード（ローカル開発用）
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const p = path.resolve(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
    break;
  }
}

loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",

  // prisma db push / migrate 用の直接接続URL
  // Vercel では環境変数から取得、ローカルでは上の loadEnv() で .env.local から読む
  ...(process.env.DIRECT_URL || process.env.DATABASE_URL
    ? {
        datasource: {
          url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
        },
      }
    : {}),
});
