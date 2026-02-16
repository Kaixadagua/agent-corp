const IdGenerator = require('../../src/utils/IdGenerator');

describe('IdGenerator Utility', () => {
  test('should return null for empty input', () => {
    expect(IdGenerator(null)).toBeNull();
    expect(IdGenerator(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = IdGenerator(input);
    expect(result).toBe(input);
  });
});
