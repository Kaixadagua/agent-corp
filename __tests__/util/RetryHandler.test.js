const RetryHandler = require('../../src/utils/RetryHandler');

describe('RetryHandler Utility', () => {
  test('should return null for empty input', () => {
    expect(RetryHandler(null)).toBeNull();
    expect(RetryHandler(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = RetryHandler(input);
    expect(result).toBe(input);
  });
});
