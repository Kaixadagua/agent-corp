// Adiciona teste de edge case
// Generated: 2026-02-11T10:40:02.890Z

const { validateInput } = require('../../src/utils/validation');

test('should validate input', () => {
  expect(() => validateInput(null)).toThrow();
  expect(validateInput('valid')).toBe('valid');
});
