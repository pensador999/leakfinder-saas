import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fallback client if .env is missing, prevents React from crashing on boot
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        insert: async () => ({ error: { message: 'Supabase URL/Key missing in .env' } }),
        select: async () => ({ data: [], error: { message: 'Supabase URL/Key missing in .env' } })
      })
    } as any;
