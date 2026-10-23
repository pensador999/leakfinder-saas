/// <reference types="node" />
// ==============================================================================
// 🛡️ Vercel Serverless Function: /api/cron/swarm-runner
// Hardened Security: Strict Bearer Token, Anti-DoS Throttling, Zero-Hardcoded Secrets
// ==============================================================================


// Anti-DoS In-Memory Rate Limiter (sliding window protection against flood attacks)
let lastExecutionTimestamp = 0;
const MIN_EXECUTION_INTERVAL_MS = 30 * 1000; // 30 seconds minimum between executions

export function __resetSwarmRunnerRateLimitForTests(): void {
  lastExecutionTimestamp = 0;
}

function sendJsonResponse(response: any, statusCode: number, data: any) {
  if (response?.status && typeof response.status === 'function') {
    return response.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    },
  });
}

export default async function handler(request: any, response: any) {
  // 1. HTTP Method Enforcement (Allow only GET or POST)
  const method = (request.method || (typeof request.headers?.get === 'function' ? 'GET' : 'GET')).toUpperCase();
  if (method !== 'GET' && method !== 'POST') {
    return sendJsonResponse(response, 405, { 
      error: 'Method Not Allowed',
      message: `HTTP ${method} is not permitted on this endpoint. Use GET or POST.`
    });
  }

  // 2. Anti-DoS Rate Limiting Guard
  const now = Date.now();
  if (now - lastExecutionTimestamp < MIN_EXECUTION_INTERVAL_MS) {
    const retryAfter = Math.ceil((MIN_EXECUTION_INTERVAL_MS - (now - lastExecutionTimestamp)) / 1000);
    return sendJsonResponse(response, 429, {
      error: 'Too Many Requests',
      message: 'Rate limit active: Autonomous pipeline is already processing or ran recently. Flooding blocked.',
      retryAfterSeconds: retryAfter
    });
  }

  // 3. Strict Bearer Token Verification (Fail-Closed)
  const isWebRequest = typeof request.headers?.get === 'function';
  const authHeader = isWebRequest 
    ? request.headers.get('authorization') 
    : request.headers?.authorization;

  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is not configured on the server, reject immediately to prevent open-access bypass
  if (!cronSecret) {
    console.error('🚨 [Security Alert] /api/cron/swarm-runner called but CRON_SECRET is not configured in environment!');
    return sendJsonResponse(response, 500, {
      error: 'Server Misconfiguration',
      message: 'CRON_SECRET is not configured in the host environment.'
    });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return sendJsonResponse(response, 401, {
      error: 'Unauthorized',
      message: 'Invalid or missing Bearer authorization token.'
    });
  }

  // 4. Validate Supabase Database Credentials (Fail-Safe Fallback to Anon Key if Service Key is not set)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('🚨 [Security Alert] Missing Supabase credentials in serverless environment.');
    return sendJsonResponse(response, 500, {
      error: 'Server Configuration Error',
      message: 'Required database credentials (VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_ANON_KEY) are missing in host environment variables.'
    });
  }

  // Record timestamp to enforce rate limiting
  lastExecutionTimestamp = now;

  // 5. Secure Execution of Autonomous 24/7 Master Pipeline
  try {
    const {
      getMonitoredStores,
      saveStoreSnapshot,
      recordSwarmJobLog,
      enqueueWhatsAppAlert
    } = await import('../../src/services/database/swarmDatabaseService');
    const { runSingleStoreSwarmAudit } = await import('../../src/services/swarm/autonomousSwarmEngine');
    const { formatDailyWhatsAppExecutiveSummary, processPendingAlertsQueue } = await import('../../src/services/workers/whatsappAlertWorker');
    const { supabase } = await import('../../src/lib/supabase');

    const stores = await getMonitoredStores();

    // Optional query filtering (?storeUrl=... or ?maxStores=... or ?timeoutMs=...)
    let storeUrlFilter = '';
    let maxStoresLimit = 3;
    let perStoreTimeoutMs = 5500;
    try {
      const reqUrl = new URL(request.url || 'http://localhost/api/cron/swarm-runner', 'http://localhost');
      storeUrlFilter = (reqUrl.searchParams.get('storeUrl') || '').trim().toLowerCase();
      const maxParam = Number(reqUrl.searchParams.get('maxStores'));
      if (maxParam > 0 && maxParam <= 10) {
        maxStoresLimit = maxParam;
      }
      const timeoutParam = Number(reqUrl.searchParams.get('timeoutMs'));
      if (timeoutParam >= 50 && timeoutParam <= 8000) {
        perStoreTimeoutMs = timeoutParam;
      }
    } catch {
      // default limits
    }

    const activeStores = stores
      .filter((s) => s.isActive)
      .filter((s) => !storeUrlFilter || s.storeUrl.toLowerCase().includes(storeUrlFilter))
      .slice(0, maxStoresLimit);

    const results: Array<{
      storeId: string;
      storeUrl: string;
      brandName: string;
      status: string;
      score?: number;
      executionTimeMs: number;
      alertQueued: boolean;
    }> = [];

    const pipelineStart = Date.now();
    const MAX_PIPELINE_BUDGET_MS = 7500;

    for (const store of activeStores) {
      if (Date.now() - pipelineStart > MAX_PIPELINE_BUDGET_MS && results.length > 0) {
        break;
      }
      const storeStart = Date.now();
      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
      try {
        const auditPromise = runSingleStoreSwarmAudit(store);
        const timeoutPromise = new Promise<null>((resolve) => {
          timeoutHandle = setTimeout(() => resolve(null), perStoreTimeoutMs);
        });
        const jobResult = await Promise.race([auditPromise, timeoutPromise]);

        if (jobResult && jobResult.diagnostic) {
          await saveStoreSnapshot(store.id, jobResult.diagnostic, jobResult.delta);
          await recordSwarmJobLog(jobResult);

          let alertQueued = false;
          if (store.targetPhone) {
            const summaryText = formatDailyWhatsAppExecutiveSummary(
              store,
              jobResult.diagnostic,
              jobResult.delta
            );
            await enqueueWhatsAppAlert({
              to: store.targetPhone,
              message: summaryText,
              priority: jobResult.diagnostic.growthScore < 70 ? 'CRITICAL' : 'HIGH',
              metadata: {
                storeId: store.id,
                storeUrl: store.storeUrl,
                score: jobResult.diagnostic.growthScore
              }
            });
            alertQueued = true;
          }

          results.push({
            storeId: store.id,
            storeUrl: store.storeUrl,
            brandName: store.brandName,
            status: jobResult.status,
            score: jobResult.diagnostic.growthScore,
            executionTimeMs: jobResult.executionTimeMs,
            alertQueued
          });
        } else {
          results.push({
            storeId: store.id,
            storeUrl: store.storeUrl,
            brandName: store.brandName,
            status: 'DEFERRED_TIMEOUT_GUARD',
            executionTimeMs: Date.now() - storeStart,
            alertQueued: false
          });
        }
      } catch {
        results.push({
          storeId: store.id,
          storeUrl: store.storeUrl,
          brandName: store.brandName,
          status: 'FAILED',
          executionTimeMs: Date.now() - storeStart,
          alertQueued: false
        });
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      }
    }

    let queueStats = { processedCount: 0, successCount: 0, failedCount: 0 };
    if (supabaseUrl && supabaseServiceKey) {
      try {
        queueStats = await processPendingAlertsQueue(supabase as any);
      } catch {
        // non-blocking
      }
    }

    // Refresh timestamp after execution so immediate subsequent flood calls hit the 30s rate limiter
    lastExecutionTimestamp = Date.now();

    const payload = {
      success: true,
      engine: 'AdShield Master Autonomous 24/7 Symphony (Hardened Serverless)',
      executedAt: new Date().toISOString(),
      auditedCount: results.length,
      alertsDispatched: queueStats.successCount,
      results,
      summary: {
        monitoredStoresCount: stores.length,
        auditedCount: results.length,
        alertsDispatched: queueStats.successCount,
        stores: stores.map((s) => s.storeUrl)
      }
    };

    return sendJsonResponse(response, 200, payload);
  } catch (err: any) {
    lastExecutionTimestamp = Date.now();
    const errorPayload = {
      success: false,
      error: err?.message || 'Master Pipeline Execution Error',
      timestamp: new Date().toISOString()
    };

    return sendJsonResponse(response, 500, errorPayload);
  }
}

