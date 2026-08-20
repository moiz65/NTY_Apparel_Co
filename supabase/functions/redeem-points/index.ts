import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authErr } = await supabaseUser.auth.getClaims(token);
    if (authErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const pts = Math.floor(Number(body?.points_to_redeem));
    if (!Number.isFinite(pts) || pts < 100 || pts % 100 !== 0) {
      return new Response(JSON.stringify({ error: 'Must redeem in multiples of 100, minimum 100' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: row } = await admin.from('user_rewards').select('points_balance, lifetime_redeemed').eq('user_id', userId).maybeSingle();
    const balance = row?.points_balance ?? 0;
    if (pts > balance) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const dollars = pts / 100;
    const code = 'NTYPTS-' + crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();

    await admin.from('rewards_transactions').insert({
      user_id: userId,
      points: -pts,
      type: 'redeemed',
      description: `Redeemed for $${dollars.toFixed(2)} (${code})`,
    });

    await admin.from('user_rewards').update({
      points_balance: balance - pts,
      lifetime_redeemed: (row?.lifetime_redeemed ?? 0) + pts,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId);

    const { data: emailData } = await admin.auth.admin.getUserById(userId);
    const email = emailData?.user?.email;
    if (email) {
      await admin.from('generated_coupons').insert({
        code, email, amount: dollars, discount_type: 'fixed', source: 'points_redemption',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(), usage_limit: 1,
      });
    }

    return new Response(JSON.stringify({
      new_balance: balance - pts,
      dollar_value: dollars,
      code,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
