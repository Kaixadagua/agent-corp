const JwtService = require('../../src/services/JwtService');

describe('JwtService Service', () => {
  let service;

  beforeEach(() => {
    service = new JwtService();
  });

  test('should create item', () => {
    const item = { id: 1, name: 'Test' };
    const result = service.create(item);
    expect(result).toEqual(item);
  });

  test('should find all items', () => {
    const items = [{ id: 1 }, { id: 2 }];
    items.forEach(item => service.create(item));
    expect(service.findAll()).toHaveLength(2);
  });
});
