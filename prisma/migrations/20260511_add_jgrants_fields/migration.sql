-- jGrantsAPI連携用フィールドを Grant テーブルに追加
-- jgrantsId: jGrants API の補助金ID（重複防止・upsert用）
-- url: 補助金詳細ページURL

ALTER TABLE "Grant" ADD COLUMN IF NOT EXISTS "jgrantsId" TEXT;
ALTER TABLE "Grant" ADD COLUMN IF NOT EXISTS "url" TEXT;

-- jgrantsId にユニークインデックスを作成
CREATE UNIQUE INDEX IF NOT EXISTS "Grant_jgrantsId_key" ON "Grant"("jgrantsId")
  WHERE "jgrantsId" IS NOT NULL;
