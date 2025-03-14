-- DropForeignKey
ALTER TABLE "ad_campaigns" DROP CONSTRAINT "ad_campaigns_postId_fkey";

-- DropForeignKey
ALTER TABLE "monthly_strategies" DROP CONSTRAINT "monthly_strategies_globalStrategyId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_monthlyStrategyId_fkey";

-- AlterTable
ALTER TABLE "ad_campaigns" ADD COLUMN     "lastModifiedBy" TEXT;

-- AlterTable
ALTER TABLE "global_strategies" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "lastModifiedBy" TEXT,
ADD COLUMN     "previousVersionId" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "instagram_accounts" ADD COLUMN     "dailyPostCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "lastPostAt" TIMESTAMP(3),
ADD COLUMN     "rateLimitReset" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "lastModifiedBy" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "lastModifiedBy" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ad_campaigns_startDate_status_idx" ON "ad_campaigns"("startDate", "status");

-- CreateIndex
CREATE INDEX "global_strategies_userId_createdAt_idx" ON "global_strategies"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "posts_scheduledFor_status_idx" ON "posts"("scheduledFor", "status");

-- AddForeignKey
ALTER TABLE "global_strategies" ADD CONSTRAINT "global_strategies_previousVersionId_fkey" FOREIGN KEY ("previousVersionId") REFERENCES "global_strategies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_strategies" ADD CONSTRAINT "monthly_strategies_globalStrategyId_fkey" FOREIGN KEY ("globalStrategyId") REFERENCES "global_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_monthlyStrategyId_fkey" FOREIGN KEY ("monthlyStrategyId") REFERENCES "monthly_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
