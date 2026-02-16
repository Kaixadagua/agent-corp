const validator = require('../../src/utils/validator');

describe('validator Utility', () => {
  test('should return null for empty input', () => {
    expect(validator(null)).toBeNull();
    expect(validator(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = validator(input);
    expect(result).toBe(input);
  });
});
