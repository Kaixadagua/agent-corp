const Logger = require('../../src/middleware/Logger');

describe('Logger Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    Logger(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    Logger(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
