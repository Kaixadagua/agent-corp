/**
 * Testes - Email
 */

const { sendEmail } = require('../src/email');

describe('Email', () => {
  test('deve exportar sendEmail', () => {
    expect(sendEmail).toBeDefined();
  });
});
