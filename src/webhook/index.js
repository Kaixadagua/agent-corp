/**
 * Webhook Handler - Processamento de webhooks
 * @module webhook
 */

class WebhookHandler {
  constructor() {
    this.handlers = new Map();
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }

  async process(event, payload) {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }
}

module.exports = WebhookHandler;
