const HashGenerator = require('../../src/utils/HashGenerator');

describe('HashGenerator Utility', () => {
  test('should return null for empty input', () => {
    expect(HashGenerator(null)).toBeNull();
    expect(HashGenerator(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = HashGenerator(input);
    expect(result).toBe(input);
  });
});
