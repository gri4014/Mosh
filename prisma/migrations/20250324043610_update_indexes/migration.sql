-- CreateIndex
CREATE INDEX "instagram_accounts_userId_idx" ON "instagram_accounts"("userId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- RenameIndex
ALTER INDEX "instagram_accounts_username_key" RENAME TO "instagram_username";

-- RenameIndex
ALTER INDEX "users_email_key" RENAME TO "user_email";
