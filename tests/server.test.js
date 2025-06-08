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

  test('POST /api/paychecks/generate creates paychecks', async () => {
    const res = await request(app)
      .post('/api/paychecks/generate')
      .send({ startDate: '2025-01-01', amount: 1000, count: 2 });
    expect(res.status).toBe(200);
    expect(res.body.created).toBe(2);

    const list = await request(app).get('/api/paychecks');
    expect(list.body.length).toBe(2);
  });

  test('PUT /api/paychecks/:id updates a paycheck', async () => {
    const res = await request(app)
      .put('/api/paychecks/1')
      .send({ date: '2025-01-01', amount: 1500 });
    expect(res.status).toBe(200);

    const list = await request(app).get('/api/paychecks');
    expect(list.body[0].amount).toBe(1500);
  });

  test('Bills are auto-assigned when paycheckId omitted', async () => {
    await request(app)
      .post('/api/bills')
      .send({ description: 'Bill A', amount: 50, dueDate: '2025-01-05' });
    await request(app)
      .post('/api/bills')
      .send({ description: 'Bill B', amount: 60, dueDate: '2025-01-20' });

    const res = await request(app).get('/api/bills');
    expect(res.body[0].paycheckId).toBe(1);
    expect(res.body[1].paycheckId).toBe(2);
  });
});
