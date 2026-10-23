-- ==============================================================================
-- 🛡️ ADSHIELD SAAS & AUTONOMOUS SWARM — UNIFIED CLOUD SCHEMA (2026.10)
-- Ensures 100% parity between Frontend/Serverless queries and PostgreSQL tables
-- with Row Level Security (RLS) policies and performance indexes.
-- ==============================================================================

-- 1. Table: public.audits (Used by DashboardPage.tsx & ReportPage.tsx)
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  site_url TEXT NOT NULL,
  business_name TEXT NOT NULL,
  result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_user_created ON public.audits(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_site_url ON public.audits(site_url);

-- 2. Table: public.swarm_monitored_stores (Used by swarmDatabaseService.ts & /api/cron/swarm-runner)
CREATE TABLE IF NOT EXISTS public.swarm_monitored_stores (
  id TEXT PRIMARY KEY,
  store_url TEXT UNIQUE NOT NULL,
  brand_name TEXT NOT NULL,
  niche TEXT DEFAULT 'E-Commerce Geral',
  target_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  check_interval_hours INTEGER NOT NULL DEFAULT 24,
  last_audited_at TIMESTAMPTZ,
  current_score INTEGER NOT NULL DEFAULT 80,
  current_estimated_loss NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_swarm_monitored_stores_active ON public.swarm_monitored_stores(is_active);

-- 3. Table: public.store_daily_snapshots (Used by saveStoreSnapshot in swarmDatabaseService.ts)
CREATE TABLE IF NOT EXISTS public.store_daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  lift_min NUMERIC DEFAULT 0,
  lift_max NUMERIC DEFAULT 0,
  broken_skus_count INTEGER NOT NULL DEFAULT 0,
  total_skus_count INTEGER NOT NULL DEFAULT 0,
  estimated_monthly_loss NUMERIC NOT NULL DEFAULT 0,
  contrast_ratio NUMERIC DEFAULT 0,
  wcag_passed BOOLEAN DEFAULT TRUE,
  raw_diagnostic_json JSONB,
  audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_daily_snapshots_store_date ON public.store_daily_snapshots(store_id, audited_at DESC);

-- 4. Table: public.swarm_job_logs (Used by recordSwarmJobLog in swarmDatabaseService.ts)
CREATE TABLE IF NOT EXISTS public.swarm_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL,
  job_status TEXT NOT NULL,
  execution_time_ms INTEGER DEFAULT 0,
  agents_executed TEXT[] DEFAULT ARRAY[]::TEXT[],
  grounding_score NUMERIC DEFAULT 100,
  false_positives_prevented INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_swarm_job_logs_store_created ON public.swarm_job_logs(store_id, created_at DESC);

-- 5. Table: public.alert_dispatch_queue (Used by enqueueWhatsAppAlert & processPendingAlertsQueue)
CREATE TABLE IF NOT EXISTS public.alert_dispatch_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT,
  phone_number TEXT NOT NULL,
  message_body TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'DAILY_EXECUTIVE_SUMMARY',
  priority TEXT NOT NULL DEFAULT 'HIGH',
  status TEXT NOT NULL DEFAULT 'PENDING',
  sent_at TIMESTAMPTZ,
  error_detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_dispatch_queue_status ON public.alert_dispatch_queue(status, created_at ASC);

-- 6. Table: public.shopify_connections (Used by /api/shopify/callback)
CREATE TABLE IF NOT EXISTS public.shopify_connections (
  shop_domain TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  scopes TEXT,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  webhook_registered BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.shopify_connections ADD COLUMN IF NOT EXISTS webhook_registered BOOLEAN NOT NULL DEFAULT FALSE;

-- 7. Table: public.kill_switch_events (Used by /api/shopify/webhooks/inventory)
CREATE TABLE IF NOT EXISTS public.kill_switch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_domain TEXT NOT NULL,
  ad_id TEXT,
  sku TEXT,
  action_taken TEXT NOT NULL DEFAULT 'PAUSED',
  reason TEXT,
  whatsapp_alert_dispatched BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kill_switch_events_shop_created ON public.kill_switch_events(shop_domain, created_at DESC);

-- ==============================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_monitored_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_dispatch_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kill_switch_events ENABLE ROW LEVEL SECURITY;

-- Policies for public.audits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audits' AND policyname = 'Users can read own or public audits'
  ) THEN
    CREATE POLICY "Users can read own or public audits"
      ON public.audits FOR SELECT
      USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audits' AND policyname = 'Users and anon can insert audits'
  ) THEN
    CREATE POLICY "Users and anon can insert audits"
      ON public.audits FOR INSERT
      WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- Policies for Autonomous Swarm & Webhook tables (Accessible by authenticated users and service role)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'swarm_monitored_stores' AND policyname = 'Allow swarm_monitored_stores access'
  ) THEN
    CREATE POLICY "Allow swarm_monitored_stores access"
      ON public.swarm_monitored_stores FOR ALL
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'store_daily_snapshots' AND policyname = 'Allow store_daily_snapshots access'
  ) THEN
    CREATE POLICY "Allow store_daily_snapshots access"
      ON public.store_daily_snapshots FOR ALL
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'swarm_job_logs' AND policyname = 'Allow swarm_job_logs access'
  ) THEN
    CREATE POLICY "Allow swarm_job_logs access"
      ON public.swarm_job_logs FOR ALL
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'alert_dispatch_queue' AND policyname = 'Allow alert_dispatch_queue access'
  ) THEN
    CREATE POLICY "Allow alert_dispatch_queue access"
      ON public.alert_dispatch_queue FOR ALL
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'shopify_connections' AND policyname = 'Allow shopify_connections access'
  ) THEN
    CREATE POLICY "Allow shopify_connections access"
      ON public.shopify_connections FOR ALL
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kill_switch_events' AND policyname = 'Allow kill_switch_events access'
  ) THEN
    CREATE POLICY "Allow kill_switch_events access"
      ON public.kill_switch_events FOR ALL
      USING (true) WITH CHECK (true);
  END IF;
END $$;
