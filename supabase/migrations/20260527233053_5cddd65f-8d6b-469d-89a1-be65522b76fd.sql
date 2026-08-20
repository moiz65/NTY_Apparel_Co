
-- user_rewards
CREATE TABLE IF NOT EXISTS public.user_rewards (
  user_id uuid PRIMARY KEY,
  points_balance integer NOT NULL DEFAULT 0,
  lifetime_earned integer NOT NULL DEFAULT 0,
  lifetime_redeemed integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_rewards TO authenticated;
GRANT ALL ON public.user_rewards TO service_role;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own rewards" ON public.user_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins view all rewards" ON public.user_rewards FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

-- rewards_transactions
CREATE TABLE IF NOT EXISTS public.rewards_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points integer NOT NULL,
  type text NOT NULL CHECK (type IN ('earned','redeemed','bonus','expired')),
  description text,
  order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rewards_transactions TO authenticated;
GRANT ALL ON public.rewards_transactions TO service_role;
ALTER TABLE public.rewards_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own ledger" ON public.rewards_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins view all ledger" ON public.rewards_transactions FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE INDEX IF NOT EXISTS rewards_transactions_user_idx ON public.rewards_transactions(user_id, created_at DESC);

-- Extend orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS billing_email text,
  ADD COLUMN IF NOT EXISTS line_items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_name text,
  ADD COLUMN IF NOT EXISTS shipping_address text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_state text,
  ADD COLUMN IF NOT EXISTS shipping_zip text,
  ADD COLUMN IF NOT EXISTS shipping_country text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS payment_verified boolean NOT NULL DEFAULT false;

-- generated_coupons
CREATE TABLE IF NOT EXISTS public.generated_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  email text NOT NULL,
  amount numeric NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percent','fixed','free_shipping')),
  source text,
  expires_at timestamptz,
  times_used integer NOT NULL DEFAULT 0,
  usage_limit integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.generated_coupons TO authenticated;
GRANT ALL ON public.generated_coupons TO service_role;
ALTER TABLE public.generated_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own coupons" ON public.generated_coupons FOR SELECT TO authenticated USING (lower(email) = lower(auth.email()));
CREATE POLICY "admins view all coupons" ON public.generated_coupons FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

-- Auto-create user_rewards row on signup (extend existing handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1))
  ) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_rewards (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  IF lower(NEW.email) IN ('gattbilly5@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Backfill rewards rows for existing users
INSERT INTO public.user_rewards (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Order verification trigger: award points + issue loyalty coupon
CREATE OR REPLACE FUNCTION public.handle_order_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_points integer;
  v_order_count integer;
  v_percent integer;
  v_code text;
BEGIN
  IF NEW.payment_verified = true AND (OLD.payment_verified IS DISTINCT FROM true) THEN
    -- Find user
    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(NEW.billing_email) LIMIT 1;
    IF v_user_id IS NULL THEN RETURN NEW; END IF;

    -- Award points (1 per $1 subtotal, floor)
    v_points := GREATEST(0, FLOOR(COALESCE(NEW.subtotal,0))::int);
    IF v_points > 0 THEN
      INSERT INTO public.rewards_transactions (user_id, points, type, description, order_id)
      VALUES (v_user_id, v_points, 'earned', 'Order ' || NEW.order_number, NEW.id);

      INSERT INTO public.user_rewards (user_id, points_balance, lifetime_earned, updated_at)
      VALUES (v_user_id, v_points, v_points, now())
      ON CONFLICT (user_id) DO UPDATE
        SET points_balance = user_rewards.points_balance + EXCLUDED.points_balance,
            lifetime_earned = user_rewards.lifetime_earned + EXCLUDED.lifetime_earned,
            updated_at = now();
    END IF;

    -- Loyalty ladder: count this user's verified orders
    SELECT count(*) INTO v_order_count FROM public.orders
      WHERE lower(billing_email) = lower(NEW.billing_email) AND payment_verified = true;

    v_percent := CASE
      WHEN v_order_count = 2 THEN 25
      WHEN v_order_count = 3 THEN 20
      WHEN v_order_count >= 4 THEN 15
      ELSE NULL
    END;

    IF v_percent IS NOT NULL THEN
      v_code := 'NTY' || v_percent || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
      INSERT INTO public.generated_coupons (code, email, amount, discount_type, source, expires_at, usage_limit)
      VALUES (v_code, NEW.billing_email, v_percent, 'percent', 'loyalty_ladder', now() + interval '35 days', 1);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_payment_verified ON public.orders;
CREATE TRIGGER on_order_payment_verified
  AFTER INSERT OR UPDATE OF payment_verified ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_verified();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_rewards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rewards_transactions;
