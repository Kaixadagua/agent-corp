// Adiciona teste de edge case
// Generated: 2026-02-11T06:00:01.734Z

const { validateInput } = require('../../src/utils/validation');

test('should validate input', () => {
  expect(() => validateInput(null)).toThrow();
  expect(validateInput('valid')).toBe('valid');
});
