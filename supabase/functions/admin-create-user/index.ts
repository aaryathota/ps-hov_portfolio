import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) throw new Error('You must be signed in.');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Your admin session has expired.');

    const { email, password } = await request.json();
    if (!email || !String(email).includes('@')) throw new Error('Enter a valid email address.');
    if (!password || String(password).length < 6) throw new Error('Password must be at least 6 characters.');

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured for this Edge Function.');

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey,
    );
    const { error } = await adminClient.auth.admin.createUser({
      email: String(email).trim(),
      password: String(password),
      email_confirm: true,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ invited: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create admin user.';
    const status = message.toLowerCase().includes('already') || message.toLowerCase().includes('registered') ? 409 : 400;
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    });
  }
});