-- AlterTable
ALTER TABLE "instagram_accounts" ADD COLUMN     "encryptedToken" TEXT,
ADD COLUMN     "lastRefreshed" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);
