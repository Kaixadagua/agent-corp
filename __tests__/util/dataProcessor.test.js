const dataProcessor = require('../../src/utils/dataProcessor');

describe('dataProcessor Utility', () => {
  test('should return null for empty input', () => {
    expect(dataProcessor(null)).toBeNull();
    expect(dataProcessor(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = dataProcessor(input);
    expect(result).toBe(input);
  });
});
