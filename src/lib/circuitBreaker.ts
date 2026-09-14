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
  isAutoSyncing: boolean;
}

const STORAGE_KEY = 'adshield_supabase_circuit_breaker';
const AUTO_RECOVERY_INTERVAL_MS = 30 * 1000; // Auto-retry silently every 30 seconds

class SupabaseCircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures: number = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = Date.now();
  private isAutoSyncing: boolean = false;
  private listeners: Set<(stats: CircuitBreakerStats) => void> = new Set();
  private autoRecoveryTimer: any = null;

  constructor() {
    this.restoreFromStorage();
    this.startSilentAutoRecovery();
  }

  private startSilentAutoRecovery() {
    if (typeof window !== 'undefined') {
      if (this.autoRecoveryTimer) clearInterval(this.autoRecoveryTimer);
      this.autoRecoveryTimer = setInterval(() => {
        // Silently probe or auto-reset to test connectivity seamlessly in background
        if (this.state === 'OPEN') {
          this.isAutoSyncing = true;
          this.notify();
          // Attempt silent recovery to allow background writes
          setTimeout(() => {
            this.state = 'HALF_OPEN';
            this.isAutoSyncing = false;
            this.saveToStorage();
            this.notify();
          }, 1200);
        }
      }, AUTO_RECOVERY_INTERVAL_MS);
    }
  }

  private restoreFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.state === 'OPEN' && parsed.lastFailureTime) {
            // Keep state recorded but keep auto-recovery active
            this.state = parsed.state;
            this.failures = parsed.failures || 1;
            this.lastFailureTime = parsed.lastFailureTime;
          }
        }
      }
    } catch {
      // Ignore storage errors
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

  public isCircuitOpen(): boolean {
    if (this.state === 'CLOSED') {
      return false;
    }

    const now = Date.now();
    if (this.state === 'OPEN' && this.lastFailureTime && (now - this.lastFailureTime > AUTO_RECOVERY_INTERVAL_MS)) {
      this.state = 'HALF_OPEN';
      this.saveToStorage();
      this.notify();
      return false; // allow canary call silently
    }

    return this.state === 'OPEN';
  }

  public recordSuccess() {
    this.failures = 0;
    this.lastSuccessTime = Date.now();
    this.isAutoSyncing = false;
    if (this.state !== 'CLOSED') {
      this.state = 'CLOSED';
      this.saveToStorage();
      this.notify();
    }
  }

  public recordFailure() {
    this.failures += 1;
    this.lastFailureTime = Date.now();
    // Keep internal state tracked for durable fallback without disrupting the UI
    this.state = 'OPEN';
    this.saveToStorage();
    this.notify();
  }

  public reset() {
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = null;
    this.lastSuccessTime = Date.now();
    this.isAutoSyncing = false;
    this.saveToStorage();
    this.notify();
  }

  public getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      isAutoSyncing: this.isAutoSyncing
    };
  }

  public subscribe(listener: (stats: CircuitBreakerStats) => void): () => void {
    this.listeners.add(listener);
    listener(this.getStats());
    return () => this.listeners.delete(listener);
  }
}

export const circuitBreaker = new SupabaseCircuitBreaker();

