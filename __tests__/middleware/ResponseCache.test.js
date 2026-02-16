const ResponseCache = require('../../src/middleware/ResponseCache');

describe('ResponseCache Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    ResponseCache(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    ResponseCache(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
