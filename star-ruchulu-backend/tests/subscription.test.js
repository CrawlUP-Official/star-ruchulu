const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Subscription System API', () => {
    afterAll(async () => {
        await db.end();
    });

    it('should reject empty email subscription', async () => {
        const res = await request(app).post('/api/v1/subscribe').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/email/i);
    });
});
