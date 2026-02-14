/**
 * Testes - Metrics
 */

const metrics = require('../src/metrics');

describe('Metrics', () => {
  test('deve incrementar contadores', () => {
    metrics.increment('test');
    expect(metrics.getReport().counters.test).toBe(1);
  });
});
