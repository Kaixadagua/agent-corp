const errorHandler = require('../../src/middleware/errorHandler');

describe('errorHandler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    errorHandler(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    errorHandler(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
