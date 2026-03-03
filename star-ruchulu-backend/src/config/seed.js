require('dotenv').config({ path: __dirname + '/../../.env' });
const db = require('./db');
const productsData = require('../../../src/data/products.json');

async function seed() {
    console.log('Starting DB seeding...');
    try {
        // Clear existing rows to prevent duplicates
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE product_weights');
        await db.query('TRUNCATE TABLE products');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        for (const p of productsData) {
            const [result] = await db.query(
                'INSERT INTO products (name, category, region, spice_level, image_url, shelf_life, storage, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [p.name, p.category, p.region || 'Unknown', p.spiceLevel || 0, p.image || '', p.shelfLife || '', p.storage || '', p.isBestSeller ? 1 : 0]
            );

            const productId = result.insertId;

            if (p.pricePerWeight) {
                for (const [weight, price] of Object.entries(p.pricePerWeight)) {
                    await db.query(
                        'INSERT INTO product_weights (product_id, weight, price) VALUES (?, ?, ?)',
                        [productId, weight, price]
                    );
                }
            }
        }
        console.log('Seeded successfully!');
    } catch (err) {
        console.error('Seed Error:', err);
    } finally {
        process.exit();
    }
}
seed();
