/**
 * Testes - Database
 */

const { connectDB } = require('../src/database');

describe('Database', () => {
  test('deve exportar connectDB', () => {
    expect(connectDB).toBeDefined();
  });
});
