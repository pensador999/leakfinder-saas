-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('admin', 'subscriber', 'agency')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'canceled', 'past_due')),
  subscription_plan TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Reports
CREATE TABLE IF NOT EXISTS public.audit_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  store_url TEXT NOT NULL,
  store_domain TEXT,
  diagnostic_data JSONB,
  catalog_health_score INTEGER,
  total_products INTEGER,
  broken_grid_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  store_url TEXT NOT NULL,
  store_domain TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  source TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Audit Reports: users read their own, insert their own
CREATE POLICY "Users read own audits" ON public.audit_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own audits" ON public.audit_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Allow anonymous inserts for non-logged-in audits
CREATE POLICY "Anon can insert audits" ON public.audit_reports FOR INSERT WITH CHECK (user_id IS NULL);

-- Leads: users read/insert their own
CREATE POLICY "Users read own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
