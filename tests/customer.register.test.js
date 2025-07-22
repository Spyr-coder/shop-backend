// tests/customer.register.test.js
const request = require('supertest');
const app = require('../server'); // path to your express app

describe('Customer Register Endpoint', () => {
  it('should reject requests without a token', async () => {
    const res = await request(app)
      .post('/api/customers/register')
      .send({ name: 'Test', phone: '0700000000' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/token/i);
  });
});
