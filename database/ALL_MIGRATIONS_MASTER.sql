-- ==============================================================================
-- 🛡️ ADSHIELD ENTERPRISE - MASTER CONSOLIDATED DATABASE MIGRATION
-- Execute this once in Supabase SQL Editor (https://supabase.com/dashboard/project/sstirifglteqmhvpsjbz/sql)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    company_name TEXT,
    tier TEXT NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO_MONTHLY', 'AGENCY_SCALE', 'ENTERPRISE')),
    credits_left INTEGER NOT NULL DEFAULT 3,
    stripe_customer_id TEXT,
    asaas_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE LOJAS MONITORADAS 24H PELO ENXAME
CREATE TABLE IF NOT EXISTS public.swarm_monitored_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_url TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    niche TEXT DEFAULT 'Geral',
    target_phone TEXT,
    is_active BOOLEAN DEFAULT true,
    check_interval_hours INTEGER DEFAULT 24,
    last_audited_at TIMESTAMP WITH TIME ZONE,
    current_score INTEGER DEFAULT 0,
    current_estimated_loss NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE SNAPSHOTS DIÁRIOS (COMPARADOR HISTÓRICO)
CREATE TABLE IF NOT EXISTS public.store_daily_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.swarm_monitored_stores(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    lift_min INTEGER NOT NULL,
    lift_max INTEGER NOT NULL,
    broken_skus_count INTEGER DEFAULT 0,
    total_skus_count INTEGER DEFAULT 0,
    estimated_monthly_loss NUMERIC(12, 2) DEFAULT 0,
    contrast_ratio NUMERIC(5, 2) DEFAULT 4.5,
    wcag_passed BOOLEAN DEFAULT true,
    raw_diagnostic_json JSONB NOT NULL,
    audited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE LOGS DO ENXAME (GROUNDING FACT-CHECK TELEMETRY)
CREATE TABLE IF NOT EXISTS public.swarm_job_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.swarm_monitored_stores(id) ON DELETE SET NULL,
    job_status TEXT NOT NULL CHECK (job_status IN ('SUCCESS', 'FAILED', 'SELF_CORRECTED', 'RUNNING')),
    execution_time_ms INTEGER NOT NULL,
    agents_executed JSONB NOT NULL,
    grounding_score INTEGER DEFAULT 100,
    false_positives_prevented INTEGER DEFAULT 0,
    corrections_applied JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE FILA DE ALERTAS WHATSAPP
CREATE TABLE IF NOT EXISTS public.alert_dispatch_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.swarm_monitored_stores(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_body TEXT NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('RUPTURE_WARNING', 'DAILY_EXECUTIVE_SUMMARY', 'SCORE_DROP', 'SCORE_IMPROVEMENT')),
    priority TEXT DEFAULT 'HIGH' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE RELATÓRIOS AUDITADOS
CREATE TABLE IF NOT EXISTS public.audit_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    growth_score INTEGER NOT NULL,
    estimated_revenue_lift_min NUMERIC(12,2) DEFAULT 0,
    estimated_revenue_lift_max NUMERIC(12,2) DEFAULT 0,
    raw_payload JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABELA DE ASSINATURAS E MRR (STRIPE & ASAAS)
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL CHECK (gateway IN ('STRIPE', 'ASAAS')),
    subscription_id TEXT NOT NULL UNIQUE,
    plan_tier TEXT NOT NULL CHECK (plan_tier IN ('PRO_MONTHLY', 'AGENCY_SCALE', 'ENTERPRISE')),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING')),
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 🔒 POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_monitored_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_dispatch_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

-- Permissões de Usuários
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their monitored stores" ON public.swarm_monitored_stores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their audit reports" ON public.audit_reports FOR SELECT USING (auth.uid() = user_id OR is_public = true);

-- Permissões Service Role (Workers Autônomos 24h)
CREATE POLICY "Service Role full access on profiles" ON public.profiles FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access on swarm stores" ON public.swarm_monitored_stores FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access on snapshots" ON public.store_daily_snapshots FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access on logs" ON public.swarm_job_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access on alerts" ON public.alert_dispatch_queue FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access on reports" ON public.audit_reports FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access on billing" ON public.billing_subscriptions FOR ALL TO service_role USING (true);

-- ==============================================================================
-- ⚡ ÍNDICES DE ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_swarm_stores_active ON public.swarm_monitored_stores(is_active, last_audited_at);
CREATE INDEX IF NOT EXISTS idx_snapshots_store_date ON public.store_daily_snapshots(store_id, audited_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_queue_pending ON public.alert_dispatch_queue(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_reports_domain ON public.audit_reports(domain);

-- ==============================================================================
-- 🚀 POPULAÇÃO INICIAL DE LOJAS PARA O ENXAME COMEÇAR A TRABALHAR
-- ==============================================================================
INSERT INTO public.swarm_monitored_stores (store_url, brand_name, niche, target_phone, is_active, check_interval_hours)
VALUES 
  ('https://www.brkagro.com.br', 'BRK Agro', 'Agropecuária & Moda Campo', '5511999999999', true, 24),
  ('https://www.brkfishing.com.br', 'BRK Fishing', 'Moda Pesca & Outdoor', '5511888888888', true, 24),
  ('https://www.brkmotors.com.br', 'BRK Motors', 'Automotivo & Performance', '5511777777777', true, 24)
ON CONFLICT DO NOTHING;
