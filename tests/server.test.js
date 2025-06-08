// Use an in-memory database for tests
process.env.DB_PATH = ':memory:';
const request = require('supertest');
const app = require('../server');

describe('API', () => {
  test('GET /api/paychecks responds with 200', async () => {
    const res = await request(app).get('/api/paychecks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/bills responds with 200', async () => {
    const res = await request(app).get('/api/bills');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
