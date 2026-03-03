const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await connection.query('CREATE DATABASE IF NOT EXISTS star_ruchulu');
        console.log('Database checked/created');

        await connection.changeUser({ database: 'star_ruchulu' });

        // Create products table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        region VARCHAR(100),
        spice_level INT,
        image_url VARCHAR(255),
        shelf_life VARCHAR(100),
        storage TEXT,
        is_best_seller BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Products table checked');

        // Create product_weights table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS product_weights (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        weight VARCHAR(50),
        price DECIMAL(10,2),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
        console.log('Product_weights table checked');

        // Create orders table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE,
        customer_name VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        total_amount DECIMAL(10,2),
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'Pending',
        order_status VARCHAR(50) DEFAULT 'Processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Orders table checked');

        // Create order_items table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_ref INT,
        product_id INT,
        weight VARCHAR(50),
        quantity INT,
        price DECIMAL(10,2),
        FOREIGN KEY (order_ref) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
        console.log('Order_items table checked');

        // Create contacts table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Contacts table checked');

        // Create subscriptions table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        coupon_code VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Subscriptions table checked');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables in database:', tables);

        await connection.end();
    } catch (err) {
        console.error('MySQL Connection/Setup Error:', err.message);
    }
}

checkDatabase();
