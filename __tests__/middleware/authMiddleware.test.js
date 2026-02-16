const authMiddleware = require('../../src/middleware/authMiddleware');

describe('authMiddleware Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    authMiddleware(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
