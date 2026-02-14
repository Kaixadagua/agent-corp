const formatDate = require('../../src/utils/formatDate');

describe('formatDate Utility', () => {
  test('should return null for empty input', () => {
    expect(formatDate(null)).toBeNull();
    expect(formatDate(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = formatDate(input);
    expect(result).toBe(input);
  });
});
