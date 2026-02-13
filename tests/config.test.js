/**
 * Testes - Config
 */

const config = require('../src/config');

describe('Config', () => {
  test('deve ter env definido', () => {
    expect(config.env).toBeDefined();
  });

  test('deve ter port definido', () => {
    expect(config.port).toBeDefined();
  });
});
