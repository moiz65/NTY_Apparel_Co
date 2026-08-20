-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Signups table
CREATE TABLE public.signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;

-- Page views table
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Dashboard metrics (for points, etc.)
CREATE TABLE public.dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key TEXT NOT NULL UNIQUE,
  metric_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Insert default metrics
INSERT INTO public.dashboard_metrics (metric_key, metric_value) VALUES
  ('total_points_balance', 0),
  ('lifetime_points_earned', 0);

-- RLS policies
CREATE POLICY "Allow read access" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update" ON public.orders FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow read access" ON public.signups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert" ON public.signups FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow read access" ON public.page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert on page_views" ON public.page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read on page_views" ON public.page_views FOR SELECT TO anon USING (true);

CREATE POLICY "Allow read access" ON public.affiliates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert" ON public.affiliates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow read access" ON public.dashboard_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow update" ON public.dashboard_metrics FOR UPDATE TO authenticated USING (true);