
-- Applications table
CREATE TABLE public.bench_club_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram_handle TEXT,
  bench_tier INTEGER NOT NULL,
  video_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bench_club_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bench_club_applications TO authenticated;
GRANT ALL ON public.bench_club_applications TO service_role;

ALTER TABLE public.bench_club_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply to bench club"
ON public.bench_club_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users view own bench applications"
ON public.bench_club_applications FOR SELECT
TO authenticated
USING (lower(email) = lower(auth.email()));

CREATE POLICY "Admins view all bench applications"
ON public.bench_club_applications FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update bench applications"
ON public.bench_club_applications FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Members table
CREATE TABLE public.bench_club_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bench_tier INTEGER NOT NULL,
  member_number SERIAL,
  application_id UUID REFERENCES public.bench_club_applications(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bench_club_members TO authenticated;
GRANT ALL ON public.bench_club_members TO service_role;

ALTER TABLE public.bench_club_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own membership"
ON public.bench_club_members FOR SELECT
TO authenticated
USING (lower(email) = lower(auth.email()) OR auth.uid() = user_id);

CREATE POLICY "Admins view all members"
ON public.bench_club_members FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage members"
ON public.bench_club_members FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
