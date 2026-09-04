// ==============================================================================
// ⚡ SUPABASE CIRCUIT BREAKER & OFFLINE-FIRST RESILIENCE ENGINE
// Automatically detects unreachable/paused cloud databases, opens the circuit,
// and redirects all operations seamlessly to local storage with ZERO console errors.
// ==============================================================================

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
}

const STORAGE_KEY = 'adshield_supabase_circuit_breaker';
const COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes cooldown before trying canary request
const MAX_FAILURES_THRESHOLD = 1; // Trip immediately on DNS / network failure

class SupabaseCircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures: number = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private listeners: Set<(stats: CircuitBreakerStats) => void> = new Set();

  constructor() {
    this.restoreFromStorage();
  }

  private restoreFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const now = Date.now();
          if (parsed.state === 'OPEN' && parsed.lastFailureTime && (now - parsed.lastFailureTime < COOLDOWN_MS)) {
            this.state = 'OPEN';
            this.failures = parsed.failures || 1;
            this.lastFailureTime = parsed.lastFailureTime;
          }
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          state: this.state,
          failures: this.failures,
          lastFailureTime: this.lastFailureTime
        }));
      }
    } catch {
      // Ignore
    }
  }

  private notify() {
    const stats = this.getStats();
    this.listeners.forEach(cb => cb(stats));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('supabase_circuit_status_change', { detail: stats }));
    }
  }

  /**
   * Check if the circuit breaker is currently preventing remote cloud calls
   */
  public isCircuitOpen(): boolean {
    if (this.state === 'CLOSED') {
      return false;
    }

    const now = Date.now();
    if (this.state === 'OPEN' && this.lastFailureTime && (now - this.lastFailureTime > COOLDOWN_MS)) {
      // Cooldown expired, transition to HALF_OPEN to test canary request
      this.state = 'HALF_OPEN';
      this.saveToStorage();
      this.notify();
      return false; // allow canary call
    }

    return this.state === 'OPEN';
  }

  /**
   * Record a successful network response from Supabase
   */
  public recordSuccess() {
    this.failures = 0;
    this.lastSuccessTime = Date.now();
    if (this.state !== 'CLOSED') {
      this.state = 'CLOSED';
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * Record a network or DNS failure, opening the circuit
   */
  public recordFailure() {
    this.failures += 1;
    this.lastFailureTime = Date.now();

    if (this.failures >= MAX_FAILURES_THRESHOLD) {
      this.state = 'OPEN';
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * Manually reset the circuit breaker (e.g. user clicked "Test Reconnection")
   */
  public reset() {
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = null;
    this.saveToStorage();
    this.notify();
  }

  public getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime
    };
  }

  public subscribe(listener: (stats: CircuitBreakerStats) => void): () => void {
    this.listeners.add(listener);
    listener(this.getStats());
    return () => this.listeners.delete(listener);
  }
}

export const circuitBreaker = new SupabaseCircuitBreaker();
