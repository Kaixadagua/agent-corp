/**
 * Testes - Rate Limiter
 */

const RateLimiter = require('../src/rateLimiter');

describe('RateLimiter', () => {
  test('deve permitir requisições dentro do limite', () => {
    const limiter = new RateLimiter(5, 60000);
    expect(limiter.isAllowed('user1')).toBe(true);
  });
});
