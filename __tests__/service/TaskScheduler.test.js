const TaskScheduler = require('../../src/services/TaskScheduler');

describe('TaskScheduler Service', () => {
  let service;

  beforeEach(() => {
    service = new TaskScheduler();
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
