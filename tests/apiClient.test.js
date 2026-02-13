/**
 * Testes - API Client
 */

const { apiClient } = require('../src/services/apiClient');

describe('API Client', () => {
  test('deve exportar apiClient', () => {
    expect(apiClient).toBeDefined();
  });

  test('deve ter baseURL configurada', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  test('deve ter timeout configurado', () => {
    expect(apiClient.defaults.timeout).toBe(10000);
  });
});
