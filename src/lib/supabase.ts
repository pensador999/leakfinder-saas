import { createClient } from '@supabase/supabase-js';

// No ambiente de dev, permitiremos mock se não houver env vars (útil para build local sem chaves configuradas)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
