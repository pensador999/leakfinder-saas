// Vercel Serverless / Edge Function: /api/cron/swarm-runner
// Triggered automatically via Vercel Cron at 07:00 UTC-3 (10:00 UTC)

import { executeMasterAutonomous24hPipeline } from '../../src/services/swarm/masterAutonomousPipeline';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // 1. Verificação de Segurança via CRON_SECRET Bearer header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'adshield_cron_super_secret_2026';

  if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid CRON_SECRET token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sstirifglteqmhvpsjbz.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_iziVMX78wmE0Duxc59_sXQ_sbjmmQ6i';

  try {
    const summary = await executeMasterAutonomous24hPipeline(supabaseUrl, supabaseServiceKey);

    return new Response(
      JSON.stringify({
        success: true,
        engine: 'AdShield Master Autonomous 24/7 Symphony (Vercel Serverless Edge)',
        summary
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Master Pipeline Execution Error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
