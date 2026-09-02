-- ✅ Remove UNIQUE constraint from email column
ALTER TABLE bench_club_members DROP INDEX email;

-- ✅ Or if you want to keep unique but allow multiple tiers
-- Add composite unique constraint on (email, weight_tier)
ALTER TABLE bench_club_members ADD UNIQUE INDEX idx_email_tier (email, weight_tier);

-- ✅ Add unique constraint to prevent duplicate tier for same user
ALTER TABLE bench_club_members 
ADD UNIQUE INDEX idx_user_tier (user_id, weight_tier);