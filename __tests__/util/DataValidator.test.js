const DataValidator = require('../../src/utils/DataValidator');

describe('DataValidator Utility', () => {
  test('should return null for empty input', () => {
    expect(DataValidator(null)).toBeNull();
    expect(DataValidator(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = DataValidator(input);
    expect(result).toBe(input);
  });
});
