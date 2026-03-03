const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Order Transaction Flow', () => {
    afterAll(async () => {
        await db.end();
    });

    it('should block creation if order lacks items', async () => {
        const res = await request(app)
            .post('/api/v1/orders')
            .send({
                customer_name: 'John Doe',
                phone: '1234567890',
                items: [] // empty items -> should fail
            });

        expect(res.statusCode).toEqual(400); // Bad Request expected
        expect(res.body.message).toMatch(/items/i);
    });
});
