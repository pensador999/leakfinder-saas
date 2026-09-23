// ==============================================================================
// 🛡️ Vercel Serverless Function: /api/cron/swarm-runner
// Hardened Security: Strict Bearer Token, Anti-DoS Throttling, Zero-Hardcoded Secrets
// ==============================================================================


// Anti-DoS In-Memory Rate Limiter (sliding window protection against flood attacks)
let lastExecutionTimestamp = 0;
const MIN_EXECUTION_INTERVAL_MS = 30 * 1000; // 30 seconds minimum between executions

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
    const { executeMasterAutonomous24hPipeline } = await import('../../src/services/swarm/masterAutonomousPipeline.ts');
    const summary = await executeMasterAutonomous24hPipeline(supabaseUrl, supabaseServiceKey);

    const payload = {
      success: true,
      engine: 'AdShield Master Autonomous 24/7 Symphony (Hardened Serverless)',
      executedAt: new Date().toISOString(),
      summary
    };

    return sendJsonResponse(response, 200, payload);
  } catch (err: any) {
    const errorPayload = {
      success: false,
      error: err?.message || 'Master Pipeline Execution Error',
      timestamp: new Date().toISOString()
    };

    return sendJsonResponse(response, 500, errorPayload);
  }
}
