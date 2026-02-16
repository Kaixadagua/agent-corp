const RateLimitMiddleware = require('../../src/middleware/RateLimitMiddleware');

describe('RateLimitMiddleware Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    RateLimitMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    RateLimitMiddleware(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
