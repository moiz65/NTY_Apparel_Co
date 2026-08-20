import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { name, email, code, link } = await req.json();
    if (!name || !email || !code) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Placeholder: log the welcome email. Wire to your email provider when ready.
    console.log('[NTY affiliate welcome]', { name, email, code, link });

    return new Response(
      JSON.stringify({
        ok: true,
        preview: {
          to: email,
          subject: `Welcome to the NTY Affiliate Program, ${name}`,
          body: `You're in. Your affiliate code is ${code}. Share your link: ${link}`,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
