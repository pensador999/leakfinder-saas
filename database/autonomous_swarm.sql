-- ==============================================================================
-- ADSHIELD AUTONOMOUS SWARM 24/7 DATABASE SCHEMA (SUPABASE POSTGRESQL + RLS)
-- Version: 2.4 Enterprise
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LOJAS MONITORADAS EM SEGUNDO PLANO
CREATE TABLE IF NOT EXISTS public.swarm_monitored_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_url TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    niche TEXT DEFAULT 'Geral',
    target_phone TEXT, -- WhatsApp para alertas diários
    is_active BOOLEAN DEFAULT true,
    check_interval_hours INTEGER DEFAULT 24,
    last_audited_at TIMESTAMP WITH TIME ZONE,
    current_score INTEGER DEFAULT 0,
    current_estimated_loss NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SNAPSHOTS HISTÓRICOS DIÁRIOS (COMPARADOR DE EVOLUÇÃO)
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

-- 3. LOGS DE EXECUÇÃO DO ENXAME (GROUNDING FACT-CHECK TELEMETRY)
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

-- 4. FILA DE DISPARO DE ALERTAS WHATSAPP
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.swarm_monitored_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_dispatch_queue ENABLE ROW LEVEL SECURITY;

-- Usuário autenticado acessa apenas suas lojas
CREATE POLICY "Users can manage their own monitored stores" 
ON public.swarm_monitored_stores 
FOR ALL USING (auth.uid() = user_id);

-- Leitura de snapshots pelo proprietário da loja
CREATE POLICY "Users can view snapshots of their stores" 
ON public.store_daily_snapshots 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.swarm_monitored_stores 
        WHERE id = store_daily_snapshots.store_id AND user_id = auth.uid()
    )
);

-- Leitura de logs pelo proprietário
CREATE POLICY "Users can view job logs of their stores" 
ON public.swarm_job_logs 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.swarm_monitored_stores 
        WHERE id = swarm_job_logs.store_id AND user_id = auth.uid()
    )
);

-- Service Role (Workers autônomos) tem acesso total de inserção e atualização
CREATE POLICY "Service Role full access on swarm tables" 
ON public.swarm_monitored_stores 
FOR ALL TO service_role USING (true);

CREATE POLICY "Service Role full access on snapshots" 
ON public.store_daily_snapshots 
FOR ALL TO service_role USING (true);

CREATE POLICY "Service Role full access on job logs" 
ON public.swarm_job_logs 
FOR ALL TO service_role USING (true);

CREATE POLICY "Service Role full access on alert queue" 
ON public.alert_dispatch_queue 
FOR ALL TO service_role USING (true);

-- Indexes de alta performance
CREATE INDEX IF NOT EXISTS idx_swarm_stores_active ON public.swarm_monitored_stores(is_active, last_audited_at);
CREATE INDEX IF NOT EXISTS idx_snapshots_store_date ON public.store_daily_snapshots(store_id, audited_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_queue_pending ON public.alert_dispatch_queue(status, priority, created_at);
