/*
  Warnings:

  - You are about to drop the column `access_token` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `account_type` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `business_id` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `encrypted_token` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `follower_count` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `following_count` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `last_refreshed` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `media_count` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `token_expires_at` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_login_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `instagram_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `instagram_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `instagram_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "instagram_accounts" DROP CONSTRAINT "instagram_accounts_user_id_fkey";

-- AlterTable
ALTER TABLE "instagram_accounts" DROP COLUMN "access_token",
DROP COLUMN "account_type",
DROP COLUMN "business_id",
DROP COLUMN "created_at",
DROP COLUMN "encrypted_token",
DROP COLUMN "follower_count",
DROP COLUMN "following_count",
DROP COLUMN "last_refreshed",
DROP COLUMN "media_count",
DROP COLUMN "refresh_token",
DROP COLUMN "token_expires_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN     "businessId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "encryptedToken" TEXT,
ADD COLUMN     "followerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastRefreshed" TIMESTAMP(3),
ADD COLUMN     "mediaCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "last_login_at",
DROP COLUMN "profile_image",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "instagram_accounts_userId_idx" ON "instagram_accounts"("userId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "instagram_accounts" ADD CONSTRAINT "instagram_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
