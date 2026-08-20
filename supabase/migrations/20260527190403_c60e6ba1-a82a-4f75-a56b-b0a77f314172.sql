ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
  ADD COLUMN IF NOT EXISTS instagram_followers INTEGER,
  ADD COLUMN IF NOT EXISTS tiktok_handle TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_followers INTEGER,
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Allow admin dashboard (currently uses anon key) to read and update affiliates
GRANT SELECT, UPDATE ON public.affiliates TO anon;

DROP POLICY IF EXISTS "Allow anon read affiliates" ON public.affiliates;
CREATE POLICY "Allow anon read affiliates"
ON public.affiliates
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Allow anon update affiliates" ON public.affiliates;
CREATE POLICY "Allow anon update affiliates"
ON public.affiliates
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert affiliates" ON public.affiliates;
CREATE POLICY "Allow anon insert affiliates"
ON public.affiliates
FOR INSERT
TO anon
WITH CHECK (true);

GRANT INSERT ON public.affiliates TO anon;