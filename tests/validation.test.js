/**
 * Testes - Validation
 */

const validators = require('../src/validation');

describe('Validation', () => {
  test('deve validar email', () => {
    expect(validators.isEmail('test@test.com')).toBe(true);
  });

  test('deve validar URL', () => {
    expect(validators.isURL('https://example.com')).toBe(true);
  });
});
