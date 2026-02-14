const logger = require('../../src/middleware/logger');

describe('logger Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    logger(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    logger(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
