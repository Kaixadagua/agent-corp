const validateEmail = require('../../src/utils/validateEmail');

describe('validateEmail Utility', () => {
  test('should return null for empty input', () => {
    expect(validateEmail(null)).toBeNull();
    expect(validateEmail(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = validateEmail(input);
    expect(result).toBe(input);
  });
});
