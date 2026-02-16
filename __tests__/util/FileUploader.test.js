const FileUploader = require('../../src/utils/FileUploader');

describe('FileUploader Utility', () => {
  test('should return null for empty input', () => {
    expect(FileUploader(null)).toBeNull();
    expect(FileUploader(undefined)).toBeNull();
  });

  test('should process valid input', () => {
    const input = { id: 1, name: 'test' };
    const result = FileUploader(input);
    expect(result).toBe(input);
  });
});
