-- ==============================================================================
-- 🛡️ LEAKFINDER SAAS - ENTERPRISE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Padrão Institucional para Auditoria de Segurança SOC-2, LGPD e Due Diligence
-- ==============================================================================

-- 1. EXTENSÕES ESSENCIAIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA: PROFILES (Extensão de Usuários com Tier e Créditos)
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

-- 3. TABELA: AUDIT_REPORTS (Histórico Completo de Auditorias Realizadas)
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

-- 4. TABELA: CONNECTED_STORES (Integrações Oficiais Read-Only com Criptografia)
CREATE TABLE IF NOT EXISTS public.connected_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_type TEXT NOT NULL CHECK (store_type IN ('SHOPIFY', 'META_ADS', 'GOOGLE_ANALYTICS_4', 'VTEX')),
    store_domain TEXT NOT NULL,
    encrypted_token TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA: WHATSAPP_WATCHDOG (Inscrições do Vigia 24h)
CREATE TABLE IF NOT EXISTS public.whatsapp_watchdog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    monitored_url TEXT NOT NULL,
    alert_hour_utc INTEGER DEFAULT 10, -- 07:00 Horário de Brasília
    is_active BOOLEAN DEFAULT true,
    last_alert_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA: BILLING_SUBSCRIPTIONS (Assinaturas e Pagamentos Recorrentes)
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
-- 🔒 POLÍTICAS DE ROW LEVEL SECURITY (RLS) - ZERO BRECHAS DE ACESSO
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_watchdog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

-- Regras Profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Regras Audit Reports
CREATE POLICY "Usuários podem ver seus próprios relatórios ou públicos" 
ON public.audit_reports FOR SELECT 
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Usuários podem inserir relatórios em sua conta" 
ON public.audit_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus relatórios" 
ON public.audit_reports FOR DELETE 
USING (auth.uid() = user_id);

-- Regras Connected Stores
CREATE POLICY "Usuários possuem acesso exclusivo às suas lojas conectadas" 
ON public.connected_stores FOR ALL 
USING (auth.uid() = user_id);

-- Regras WhatsApp Watchdog
CREATE POLICY "Usuários gerenciam seus próprios alertas de WhatsApp" 
ON public.whatsapp_watchdog FOR ALL 
USING (auth.uid() = user_id);

-- Regras Billing Subscriptions
CREATE POLICY "Usuários podem ver suas próprias assinaturas" 
ON public.billing_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- ==============================================================================
-- ⚡ ÍNDICES PARA ALTA PERFORMANCE (ESCALA > 100K RELATÓRIOS)
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_audit_reports_user_id ON public.audit_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_reports_domain ON public.audit_reports(domain);
CREATE INDEX IF NOT EXISTS idx_connected_stores_user_id ON public.connected_stores(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_watchdog_active ON public.whatsapp_watchdog(is_active);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status ON public.billing_subscriptions(status);

-- ==============================================================================
-- 🤖 TRIGGER AUTOMÁTICO: CRIAR PROFILE NO SIGNUP DO SUPABASE AUTH
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
