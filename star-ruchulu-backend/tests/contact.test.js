const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Contact Form API', () => {
    afterAll(async () => {
        await db.end();
    });

    it('should reject contact without name, email, message', async () => {
        const res = await request(app)
            .post('/api/v1/contact')
            .send({ name: 'Only Name' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/required/i);
    });
});
