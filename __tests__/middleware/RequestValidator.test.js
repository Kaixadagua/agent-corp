const RequestValidator = require('../../src/middleware/RequestValidator');

describe('RequestValidator Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test('should call next()', () => {
    RequestValidator(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should set timestamp', () => {
    RequestValidator(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('number');
  });
});
