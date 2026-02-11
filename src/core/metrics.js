// Sistema de métricas avançadas
// Coleta e reporta métricas de performance

class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.histograms = new Map();
    this.startTime = Date.now();
  }

  // Contador simples
  increment(name, labels = {}) {
    const key = this.makeKey(name, labels);
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
  }

  // Timer para medições
  timer(name, labels = {}) {
    const start = Date.now();
    return {
      end: () => {
        const duration = Date.now() - start;
        this.recordHistogram(name, duration, labels);
      }
    };
  }

  recordHistogram(name, value, labels = {}) {
    const key = this.makeKey(name, labels);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    this.histograms.get(key).push(value);
  }

  makeKey(name, labels) {
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return labelStr ? `${name}{${labelStr}}` : name;
  }

  // Gerar relatório
  getReport() {
    const report = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      counters: {},
      histograms: {}
    };

    for (const [key, value] of this.metrics) {
      report.counters[key] = value;
    }

    for (const [key, values] of this.histograms) {
      report.histograms[key] = {
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    }

    return report;
  }

  // Exportar no formato Prometheus
  toPrometheus() {
    const lines = [];
    
    for (const [key, value] of this.metrics) {
      lines.push(`# TYPE ${key} counter`);
      lines.push(`${key} ${value}`);
    }

    for (const [key, stats] of this.histograms) {
      lines.push(`# TYPE ${key}_sum gauge`);
      lines.push(`${key}_sum ${stats.sum}`);
    }

    return lines.join('\n');
  }
}

module.exports = { MetricsCollector };
