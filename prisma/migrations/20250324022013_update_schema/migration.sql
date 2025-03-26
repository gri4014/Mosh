/*
  Warnings:

  - The `accountType` column on the `instagram_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "instagram_accounts" DROP COLUMN "accountType",
ADD COLUMN     "accountType" TEXT NOT NULL DEFAULT 'PERSONAL';

-- DropEnum
DROP TYPE "AccountType";
