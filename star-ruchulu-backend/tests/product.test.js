// Mocking actual DB query to avoid complex table setup
// Jest spy will bypass actual logic for safe isolated CI testing
jest.mock('../src/models/productModel', () => {
    return {
        findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Spicy Mango' }]),
        findById: jest.fn().mockResolvedValue({ id: 2, name: 'Gongura Pickle' })
    };
});

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');


describe('Product Endpoints', () => {
    afterAll(async () => {
        // Clean up connections so Jest exits properly
        await db.end();
    });



    it('should fetch all products safely', async () => {
        const res = await request(app).get('/api/v1/products');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should fetch single product safely by ID', async () => {
        const res = await request(app).get('/api/v1/products/2');
        expect(res.statusCode).toEqual(200);
    });
});
