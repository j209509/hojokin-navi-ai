/**
 * lib/admin.ts — 管理者判定ヘルパー
 * ADMIN_EMAIL 環境変数と照合して管理者かどうかを返す
 */

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}
