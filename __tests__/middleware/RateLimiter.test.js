const RateLimiter = require('../../src/middleware/RateLimiter');

describe('RateLimiter Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    RateLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    RateLimiter(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
