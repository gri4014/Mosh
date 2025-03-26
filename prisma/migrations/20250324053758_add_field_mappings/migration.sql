/*
  Warnings:

  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastLoginAt",
ADD COLUMN     "last_login_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "instagram_accounts_userId_idx" ON "instagram_accounts"("userId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
