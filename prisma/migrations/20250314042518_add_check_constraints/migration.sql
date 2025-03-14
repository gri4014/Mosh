-- Add CHECK constraints
ALTER TABLE "subscriptions" ADD CONSTRAINT "check_monthly_amount_positive" CHECK ("monthlyAmount" > 0);

ALTER TABLE "monthly_strategies" ADD CONSTRAINT "check_valid_month" CHECK ("month" >= 1 AND "month" <= 12);

ALTER TABLE "ad_campaigns" ADD CONSTRAINT "check_budget_positive" CHECK ("budget" > 0);

-- Add explanatory comment
COMMENT ON CONSTRAINT "check_monthly_amount_positive" ON "subscriptions" IS 'Ensures subscription amount is positive';
COMMENT ON CONSTRAINT "check_valid_month" ON "monthly_strategies" IS 'Ensures month is between 1 and 12';
COMMENT ON CONSTRAINT "check_budget_positive" ON "ad_campaigns" IS 'Ensures ad campaign budget is positive';
