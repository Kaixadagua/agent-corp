const ErrorHandler = require('../../src/middleware/ErrorHandler');

describe('ErrorHandler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    ErrorHandler(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    ErrorHandler(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
