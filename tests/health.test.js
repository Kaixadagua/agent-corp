/**
 * Testes - Health
 */

const { healthCheck } = require('../src/health');

describe('Health', () => {
  test('deve retornar status saudável', async () => {
    const result = await healthCheck();
    expect(result.status).toBe('healthy');
  });
});
