// App Router用 NextAuth ルートハンドラー
// Pages RouterのpageS/api/auth/[...nextauth].tsに相当
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
