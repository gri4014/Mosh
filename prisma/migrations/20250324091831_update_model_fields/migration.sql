/*
  Warnings:

  - You are about to drop the column `accessToken` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accountType` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedToken` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `followerCount` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `lastRefreshed` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `mediaCount` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiresAt` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `instagram_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `access_token` to the `instagram_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `instagram_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `instagram_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "instagram_accounts" DROP CONSTRAINT "instagram_accounts_userId_fkey";

-- DropIndex
DROP INDEX "instagram_accounts_userId_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- AlterTable
ALTER TABLE "instagram_accounts" DROP COLUMN "accessToken",
DROP COLUMN "accountType",
DROP COLUMN "businessId",
DROP COLUMN "createdAt",
DROP COLUMN "encryptedToken",
DROP COLUMN "followerCount",
DROP COLUMN "followingCount",
DROP COLUMN "lastRefreshed",
DROP COLUMN "mediaCount",
DROP COLUMN "refreshToken",
DROP COLUMN "tokenExpiresAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "account_type" "AccountType" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN     "business_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "encrypted_token" TEXT,
ADD COLUMN     "follower_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_refreshed" TIMESTAMP(3),
ADD COLUMN     "media_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "token_expires_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "lastLoginAt",
DROP COLUMN "profileImage",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_login_at" TIMESTAMP(6),
ADD COLUMN     "profile_image" VARCHAR(255),
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "instagram_accounts_user_id_idx" ON "instagram_accounts"("user_id");

-- AddForeignKey
ALTER TABLE "instagram_accounts" ADD CONSTRAINT "instagram_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
