/**
 * Testes - Logger
 */

const { Logger } = require('../src/core/logger');

describe('Logger', () => {
  test('deve exportar métodos de log', () => {
    expect(Logger.info).toBeDefined();
    expect(Logger.error).toBeDefined();
    expect(Logger.warn).toBeDefined();
  });
});
