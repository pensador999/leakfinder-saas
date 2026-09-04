import { createClient } from '@supabase/supabase-js';
import { circuitBreaker } from './circuitBreaker';

const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const isSupabaseConfigured = isConfigured;

// ⚡ Custom Resilient Fetch with Circuit Breaker
const resilientFetch: typeof fetch = async (input, init) => {
  // If circuit is open, avoid making network request and return immediate offline response
  if (circuitBreaker.isCircuitOpen()) {
    return new Response(JSON.stringify({ 
      error: 'Circuit Breaker Active: Supabase is paused or unreachable. Operating in local fallback mode.' 
    }), {
      status: 503,
      statusText: 'Service Unavailable (Circuit Open)',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch(input, init);
    if (res.ok || res.status < 500) {
      circuitBreaker.recordSuccess();
    } else {
      circuitBreaker.recordFailure();
    }
    return res;
  } catch {
    // Network or DNS resolution failure detected
    circuitBreaker.recordFailure();
    // Return synthetic response instead of throwing uncaught TypeError to eliminate browser console noise
    return new Response(JSON.stringify({ 
      error: 'Network connection to Supabase failed. Fallback to local storage engaged.' 
    }), {
      status: 503,
      statusText: 'Service Unavailable (Fetch Failed)',
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: isConfigured,
    autoRefreshToken: isConfigured,
    detectSessionInUrl: isConfigured
  },
  global: {
    fetch: resilientFetch
  }
});
