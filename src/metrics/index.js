/**
 * Metrics - Coletor de métricas
 * @module metrics
 */

class Metrics {
  constructor() {
    this.counters = new Map();
    this.timers = new Map();
  }

  increment(name, value = 1) {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);
  }

  time(name, duration) {
    if (!this.timers.has(name)) {
      this.timers.set(name, []);
    }
    this.timers.get(name).push(duration);
  }

  getReport() {
    return {
      counters: Object.fromEntries(this.counters),
      timers: Object.fromEntries(this.timers)
    };
  }
}

module.exports = new Metrics();
