const request = require('supertest');
const express = require('express');
const apiRouter = require('../../src/routes/api');

const app = express();
app.use('/api', apiRouter);

describe('api Routes', () => {
  test('GET / should return status ok', async () => {
    const res = await request(app).get('/api/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.route).toBe('api');
  });
});
