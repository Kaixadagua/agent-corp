/**
 * Testes - Queue
 */

const Queue = require('../src/queue');

describe('Queue', () => {
  test('deve adicionar e remover itens', () => {
    const q = new Queue();
    q.enqueue(1);
    expect(q.dequeue()).toBe(1);
  });
});
