
-- Auto-commission trigger
CREATE OR REPLACE FUNCTION public.handle_affiliate_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_link RECORD;
  v_commission NUMERIC;
BEGIN
  IF NEW.coupon_code IS NULL OR NEW.coupon_code = '' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO v_link
  FROM public.affiliate_coupon_links
  WHERE upper(code) = upper(NEW.coupon_code) AND active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  v_commission := ROUND(COALESCE(NEW.total, NEW.amount, 0) * (v_link.commission_percent / 100.0), 2);

  INSERT INTO public.affiliate_referrals
    (affiliate_id, referral_code, order_number, customer_email, order_amount, commission_amount, status)
  VALUES
    (v_link.affiliate_id, v_link.code, NEW.order_number, NEW.customer_email,
     COALESCE(NEW.total, NEW.amount, 0), v_commission, 'approved');

  UPDATE public.affiliates
  SET earnings = COALESCE(earnings, 0) + v_commission
  WHERE id = v_link.affiliate_id;

  UPDATE public.affiliate_coupon_links
  SET uses_count = COALESCE(uses_count, 0) + 1
  WHERE id = v_link.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_affiliate_order ON public.orders;
CREATE TRIGGER trg_affiliate_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_affiliate_order();

-- Test affiliate application
INSERT INTO public.affiliate_applications
  (name, email, first_name, last_name, phone, instagram_handle, instagram_followers,
   tiktok_handle, tiktok_followers, social_handles, total_followers_range,
   platform_info, how_did_you_find, additional_notes, why_join, audience_description, status)
VALUES
  ('Test Affiliate', 'test.affiliate@ntyapparel.com', 'Test', 'Affiliate', '+1 555-0199',
   'testaffiliate', 25400, 'testaffiliate', 48000,
   '@testaffiliate (IG + TikTok), @test.affiliate (YT)', '50k-100k',
   'Fitness + natural lifting content, mostly US 18-30 male audience.',
   'Instagram', 'Excited to rep NTY at the gym and on socials.',
   'Love the brand mission for natural lifters.',
   'Lifting + lifestyle content creator, high engagement audience.',
   'pending');
