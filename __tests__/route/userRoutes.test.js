const request = require('supertest');
const express = require('express');
const userRoutesRouter = require('../../src/routes/userRoutes');

const app = express();
app.use('/userroutes', userRoutesRouter);

describe('userRoutes Routes', () => {
  test('GET / should return status ok', async () => {
    const res = await request(app).get('/userroutes/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.route).toBe('userRoutes');
  });
});
