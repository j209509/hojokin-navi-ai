import { defineConfig } from "prisma/config";

// Prisma 7: スキーマのパスを明示
export default defineConfig({
  schema: "prisma/schema.prisma",
});
