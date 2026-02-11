// Adiciona teste de edge case
// Generated: 2026-02-11T19:05:03.844Z

const { validateInput } = require('../../src/utils/validation');

test('should validate input', () => {
  expect(() => validateInput(null)).toThrow();
  expect(validateInput('valid')).toBe('valid');
});
