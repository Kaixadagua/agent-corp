const request = require('supertest');
const express = require('express');
const WebhookHandlerRouter = require('../../src/routes/WebhookHandler');

const app = express();
app.use('/webhookhandler', WebhookHandlerRouter);

describe('WebhookHandler Routes', () => {
  test('GET / should return status ok', async () => {
    const res = await request(app).get('/webhookhandler/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.route).toBe('WebhookHandler');
  });
});
