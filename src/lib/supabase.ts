import { createClient } from '@supabase/supabase-js';

const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const isSupabaseConfigured = isConfigured;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: isConfigured,
    autoRefreshToken: isConfigured,
    detectSessionInUrl: isConfigured
  }
});
