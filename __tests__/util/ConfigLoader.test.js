const ConfigLoader = require('../../src/utils/ConfigLoader');

describe('ConfigLoader Utility', () => {
  test('should return null for empty input', () => {
    expect(ConfigLoader(null)).toBeNull();
    expect(ConfigLoader(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = ConfigLoader(input);
    expect(result).toBe(input);
  });
});
