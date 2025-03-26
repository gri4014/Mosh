/*
  Warnings:

  - The `accountType` column on the `instagram_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "InstagramAccountType" AS ENUM ('PERSONAL', 'BUSINESS', 'CREATOR');

-- DropIndex
DROP INDEX "instagram_accounts_userId_idx";

-- AlterTable
ALTER TABLE "instagram_accounts" DROP COLUMN "accountType",
ADD COLUMN     "accountType" "InstagramAccountType" NOT NULL DEFAULT 'PERSONAL';
