/**
 * Testes - Auth
 */

const { generateToken, verifyToken } = require('../src/auth');

describe('Auth', () => {
  test('deve exportar funções', () => {
    expect(generateToken).toBeDefined();
    expect(verifyToken).toBeDefined();
  });
});
