const QueryBuilder = require('../../src/utils/QueryBuilder');

describe('QueryBuilder Utility', () => {
  test('should return null for empty input', () => {
    expect(QueryBuilder(null)).toBeNull();
    expect(QueryBuilder(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = QueryBuilder(input);
    expect(result).toBe(input);
  });
});
