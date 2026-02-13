/**
 * Testes - Cache
 */

const cache = require('../src/cache');

describe('Cache', () => {
  test('deve set e get valores', () => {
    cache.set('test', 'value');
    expect(cache.get('test')).toBe('value');
  });
});
