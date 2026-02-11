// Adiciona teste de edge case
// Generated: 2026-02-11T17:30:02.313Z

const { validateInput } = require('../../src/utils/validation');

test('should validate input', () => {
  expect(() => validateInput(null)).toThrow();
  expect(validateInput('valid')).toBe('valid');
});
