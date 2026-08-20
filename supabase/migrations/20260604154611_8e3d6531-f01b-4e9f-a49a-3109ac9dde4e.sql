
-- ============ AFFILIATES ============
DROP POLICY IF EXISTS "Allow anon insert affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Allow anon read affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Allow anon update affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Allow insert" ON public.affiliates;
DROP POLICY IF EXISTS "Allow read access" ON public.affiliates;

REVOKE ALL ON public.affiliates FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliates TO authenticated;
GRANT ALL ON public.affiliates TO service_role;

CREATE POLICY "Admins manage affiliates"
  ON public.affiliates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Affiliates view own record"
  ON public.affiliates FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.email()));

-- ============ ORDERS ============
DROP POLICY IF EXISTS "Allow insert" ON public.orders;
DROP POLICY IF EXISTS "Allow update" ON public.orders;

CREATE POLICY "Users insert own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

-- ============ SIGNUPS ============
DROP POLICY IF EXISTS "Allow read access" ON public.signups;
DROP POLICY IF EXISTS "Allow insert" ON public.signups;

CREATE POLICY "Anyone can sign up"
  ON public.signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins view signups"
  ON public.signups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

GRANT INSERT ON public.signups TO anon;

-- ============ DASHBOARD METRICS ============
DROP POLICY IF EXISTS "Allow update" ON public.dashboard_metrics;

CREATE POLICY "Admins update metrics"
  ON public.dashboard_metrics FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============ USER ROLES (prevent privilege escalation) ============
CREATE POLICY "Only admins insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============ SECURITY DEFINER FUNCTION EXECUTE GRANTS ============
-- Trigger-only functions should not be callable via the API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_order_verified() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_affiliate_order() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
-- has_role is intentionally callable by authenticated for RLS expressions
