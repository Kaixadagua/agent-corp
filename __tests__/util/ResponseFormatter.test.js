const ResponseFormatter = require('../../src/utils/ResponseFormatter');

describe('ResponseFormatter Utility', () => {
  test('should return null for empty input', () => {
    expect(ResponseFormatter(null)).toBeNull();
    expect(ResponseFormatter(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = ResponseFormatter(input);
    expect(result).toBe(input);
  });
});
