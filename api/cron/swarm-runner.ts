// Vercel Serverless Function: /api/cron/swarm-runner
// Triggered automatically via Vercel Cron at 07:00 UTC-3 (10:00 UTC)

import { executeMasterAutonomous24hPipeline } from '../../src/services/swarm/masterAutonomousPipeline';

export default async function handler(request: any, response: any) {
  // Check if called as standard Node handler or Web Request
  const isWebRequest = typeof request.headers?.get === 'function';
  const authHeader = isWebRequest 
    ? request.headers.get('authorization') 
    : request.headers?.authorization;

  const cronSecret = process.env.CRON_SECRET || 'adshield_cron_super_secret_2026';

  if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
    if (response?.status) {
      return response.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET token' });
    }
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid CRON_SECRET token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sstirifglteqmhvpsjbz.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_iziVMX78wmE0Duxc59_sXQ_sbjmmQ6i';

  try {
    const summary = await executeMasterAutonomous24hPipeline(supabaseUrl, supabaseServiceKey);

    const payload = {
      success: true,
      engine: 'AdShield Master Autonomous 24/7 Symphony (Vercel Serverless)',
      summary
    };

    if (response?.status) {
      return response.status(200).json(payload);
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const errorPayload = {
      success: false,
      error: err?.message || 'Master Pipeline Execution Error'
    };

    if (response?.status) {
      return response.status(500).json(errorPayload);
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
