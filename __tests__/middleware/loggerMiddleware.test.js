const loggerMiddleware = require('../../src/middleware/loggerMiddleware');

describe('loggerMiddleware Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    loggerMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    loggerMiddleware(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
