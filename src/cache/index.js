/**
 * Cache Module - Cache em memória
 * @module cache
 */

class Cache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  set(key, value, ttl = 3600000) {
    this.store.set(key, value);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    this.timers.set(key, setTimeout(() => this.delete(key), ttl));
  }

  get(key) {
    return this.store.get(key);
  }

  delete(key) {
    this.store.delete(key);
    this.timers.delete(key);
  }

  clear() {
    this.store.clear();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}

module.exports = new Cache();
