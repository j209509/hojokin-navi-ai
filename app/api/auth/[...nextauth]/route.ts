// App Router用 NextAuth ルートハンドラー
import { handlers } from "@/auth";

// 認証APIは常に動的レンダリング（DBアクセスが必要）
export const dynamic = "force-dynamic";

export const { GET, POST } = handlers;
