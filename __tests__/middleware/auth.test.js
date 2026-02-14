const auth = require('../../src/middleware/auth');

describe('auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    auth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    auth(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
