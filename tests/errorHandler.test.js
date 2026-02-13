/**
 * Testes - Error Handler
 */

const { AppError, asyncHandler } = require('../src/core/errorHandler');

describe('Error Handler', () => {
  test('AppError deve criar erro com valores padrão', () => {
    const error = new AppError('Test');
    expect(error.message).toBe('Test');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
  });

  test('asyncHandler deve ser função', () => {
    expect(typeof asyncHandler).toBe('function');
  });
});
