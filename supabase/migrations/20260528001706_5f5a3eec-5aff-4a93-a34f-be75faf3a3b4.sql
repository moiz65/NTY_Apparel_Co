ALTER TABLE public.affiliate_applications
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS social_handles text,
  ADD COLUMN IF NOT EXISTS total_followers_range text,
  ADD COLUMN IF NOT EXISTS platform_info text,
  ADD COLUMN IF NOT EXISTS how_did_you_find text,
  ADD COLUMN IF NOT EXISTS additional_notes text;
ALTER TABLE public.affiliate_applications ALTER COLUMN name DROP NOT NULL;