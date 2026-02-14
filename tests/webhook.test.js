/**
 * Testes - Webhook Handler
 */

const WebhookHandler = require('../src/webhook');

describe('WebhookHandler', () => {
  test('deve registrar e processar handlers', async () => {
    const handler = new WebhookHandler();
    let called = false;
    handler.on('test', () => { called = true; });
    await handler.process('test', {});
    expect(called).toBe(true);
  });
});
