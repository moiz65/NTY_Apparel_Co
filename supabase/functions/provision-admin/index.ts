import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = 'Gattbilly5@gmail.com';
const ADMIN_PASSWORD = 'Phantoms';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Check if user exists
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list?.users?.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  let userId: string;
  if (existing) {
    userId = existing.id;
    await admin.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD, email_confirm: true });
  } else {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL, password: ADMIN_PASSWORD, email_confirm: true,
      user_metadata: { display_name: 'NTY Admin' },
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    userId = created.user!.id;
  }

  // Ensure admin role
  await admin.from('user_roles').upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

  return new Response(JSON.stringify({ ok: true, email: ADMIN_EMAIL, user_id: userId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
