const PaginationHelper = require('../../src/utils/PaginationHelper');

describe('PaginationHelper Utility', () => {
  test('should return null for empty input', () => {
    expect(PaginationHelper(null)).toBeNull();
    expect(PaginationHelper(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = PaginationHelper(input);
    expect(result).toBe(input);
  });
});
