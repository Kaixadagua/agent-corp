const request = require('supertest');
const express = require('express');
const usersRouter = require('../../src/routes/users');

const app = express();
app.use('/users', usersRouter);

describe('users Routes', () => {
  test('GET / should return status ok', async () => {
    const res = await request(app).get('/users/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.route).toBe('users');
  });
  
  test('should include timestamp', async () => {
    const res = await request(app).get('/users/');
    expect(res.body.timestamp).toBeDefined();
  });
});
