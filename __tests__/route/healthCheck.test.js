const request = require('supertest');
const express = require('express');
const healthCheckRouter = require('../../src/routes/healthCheck');

const app = express();
app.use('/healthcheck', healthCheckRouter);

describe('healthCheck Routes', () => {
  test('GET / should return status ok', async () => {
    const res = await request(app).get('/healthcheck/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.route).toBe('healthCheck');
  });
});
