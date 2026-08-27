// Vercel Serverless / Edge Function: /api/cron/swarm-runner
// Triggered automatically via Vercel Cron or Supabase pg_cron at 07:00 UTC-3

import { executeAutonomousStoreAudit, MonitoredStore } from '../../src/services/swarm/autonomousSwarmEngine';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // 1. Authorization check via CRON_SECRET Bearer header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'adshield_cron_dev_secret_2026';

  if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid CRON_SECRET' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const startTime = Date.now();

  // 2. Sample or Supabase fetched stores list
  const sampleStores: MonitoredStore[] = [
    {
      id: 'store-brk-agro',
      storeUrl: 'https://www.brkagro.com.br',
      brandName: 'BRK Agro',
      niche: 'Agropecuária & Moda Campo',
      targetPhone: '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 78,
      currentEstimatedLoss: 840
    },
    {
      id: 'store-brk-fishing',
      storeUrl: 'https://www.brkfishing.com.br',
      brandName: 'BRK Fishing',
      niche: 'Moda Pesca & Outdoor',
      targetPhone: '5511888888888',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 84,
      currentEstimatedLoss: 520
    }
  ];

  const executionResults = [];

  for (const store of sampleStores) {
    const jobResult = await executeAutonomousStoreAudit(store);
    executionResults.push({
      storeId: jobResult.storeId,
      brandName: jobResult.brandName,
      status: jobResult.status,
      executionTimeMs: jobResult.executionTimeMs,
      groundingScore: jobResult.groundingScore,
      falsePositivesPrevented: jobResult.falsePositivesPrevented,
      alertGenerated: Boolean(jobResult.alertGenerated)
    });
  }

  const totalTime = Date.now() - startTime;

  return new Response(
    JSON.stringify({
      success: true,
      engine: 'AdShield Autonomous Swarm 24/7',
      totalStoresAudited: sampleStores.length,
      totalExecutionTimeMs: totalTime,
      results: executionResults
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
