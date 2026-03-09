require('dotenv').config();
const db = require('./src/config/db');
const productModel = require('./src/models/productModel');

const defaultProducts = [
    {
        productData: {
            name: 'Gongura Pickle',
            category: 'Veg Pickles',
            region: 'Andhra',
            spice_level: 5,
            image_url: '/images/gongura-pickle.jpg',
            shelf_life: '6 Months',
            storage: 'Cool dry place',
            is_best_seller: true
        },
        weights: [
            { weight: '250g', price: 150 },
            { weight: '500g', price: 290 },
            { weight: '1kg', price: 550 }
        ]
    },
    {
        productData: {
            name: 'Mango Pickle (Avakaya)',
            category: 'Veg Pickles',
            region: 'Coastal Andhra',
            spice_level: 4,
            image_url: '/images/avakaya.jpg',
            shelf_life: '6 Months',
            storage: 'Cool dry place',
            is_best_seller: true
        },
        weights: [
            { weight: '250g', price: 160 },
            { weight: '500g', price: 310 },
            { weight: '1kg', price: 600 }
        ]
    },
    {
        productData: {
            name: 'Traditional Bobbatlu',
            category: 'Sweets',
            region: 'Rayalaseema',
            spice_level: 1,
            image_url: '/images/bobbatlu.jpg',
            shelf_life: '2 Weeks',
            storage: 'Refrigerate',
            is_best_seller: true
        },
        weights: [
            { weight: '250px', price: 120 },
            { weight: '500px', price: 230 },
            { weight: '1kg', price: 450 }
        ]
    },
    {
        productData: {
            name: 'Andhra Boondi Laddu',
            category: 'Sweets',
            region: 'Godavari',
            spice_level: 1,
            image_url: '/images/boondi-laddu.jpg',
            shelf_life: '1 Month',
            storage: 'Airtight Container',
            is_best_seller: false
        },
        weights: [
            { weight: '250g', price: 140 },
            { weight: '500g', price: 270 },
            { weight: '1kg', price: 520 }
        ]
    },
    {
        productData: {
            name: 'Crispy Murukulu',
            category: 'Snacks',
            region: 'Palnadu',
            spice_level: 3,
            image_url: '/images/murukulu.jpg',
            shelf_life: '2 Months',
            storage: 'Airtight Container',
            is_best_seller: true
        },
        weights: [
            { weight: '250g', price: 100 },
            { weight: '500g', price: 190 },
            { weight: '1kg', price: 360 }
        ]
    }
];

const seedProducts = async () => {
    try {
        console.log('Seeding products...');

        // Optional: truncate table first if needed, but let's just insert these.
        // Wait, to avoid duplicates we can clear the products table.
        const connection = await db.getConnection();
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE table product_weights');
        await connection.query('TRUNCATE table products');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        connection.release();

        for (const item of defaultProducts) {
            await productModel.create(item.productData, item.weights);
        }

        console.log('Products seeded successfully!');
    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        process.exit();
    }
};

seedProducts();
