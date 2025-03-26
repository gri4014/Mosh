-- DropIndex
DROP INDEX "instagram_accounts_userId_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- RenameIndex
ALTER INDEX "instagram_username" RENAME TO "instagram_accounts_username_key";

-- RenameIndex
ALTER INDEX "user_email" RENAME TO "users_email_key";
