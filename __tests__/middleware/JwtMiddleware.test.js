const JwtMiddleware = require('../../src/middleware/JwtMiddleware');

describe('JwtMiddleware Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    JwtMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    JwtMiddleware(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
