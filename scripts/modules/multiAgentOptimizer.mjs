// ==============================================================================
// ⚡ MULTI-AGENT OPTIMIZER & PROFILER — SKILL: agent-orchestration-multi-agent-optimize
// Coordinates multi-agent workflows with profiling, concurrent batching,
// and zero-blocking execution for 100+ stores.
// ==============================================================================

export class MultiAgentProfiler {
  constructor() {
    this.cycleStart = Date.now();
    this.stepTimers = {};
  }

  startStep(stepName) {
    this.stepTimers[stepName] = { start: Date.now(), end: null, durationMs: null };
  }

  endStep(stepName) {
    if (this.stepTimers[stepName]) {
      this.stepTimers[stepName].end = Date.now();
      this.stepTimers[stepName].durationMs = this.stepTimers[stepName].end - this.stepTimers[stepName].start;
    }
  }

  getSummary() {
    const totalMs = Date.now() - this.cycleStart;
    const breakdown = {};
    for (const [key, val] of Object.entries(this.stepTimers)) {
      breakdown[key] = `${val.durationMs || 0}ms`;
    }
    return {
      totalDurationMs: totalMs,
      totalDurationFormatted: `${(totalMs / 1000).toFixed(2)}s`,
      breakdown
    };
  }
}

/**
 * Concurrently processes an array of items with a concurrency limit.
 * @param {Array} items - Target stores or tasks.
 * @param {Function} taskFn - Async task handler.
 * @param {number} concurrency - Max concurrent workers (default: 4).
 */
export async function executeParallelOptimized(items, taskFn, concurrency = 4) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => taskFn(item));
    results.push(p);

    if (concurrency <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.allSettled(results);
}
