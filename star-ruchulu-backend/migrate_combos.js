const db = require('./src/config/db');

async function migrateCombos() {
    try {
        console.log('Creating combos table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS combos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(255),
                price DECIMAL(10, 2) NOT NULL,
                original_price DECIMAL(10, 2) NOT NULL,
                tag VARCHAR(255),
                is_best_seller BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Creating combo_items table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS combo_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                combo_id INT,
                product_id INT,
                weight VARCHAR(50),
                quantity INT,
                FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        console.log('Clearing old combos for fresh seed...');
        await db.query(`DELETE FROM combos`);
        await db.query(`ALTER TABLE combos AUTO_INCREMENT = 1`);

        console.log('Inserting default combos...');
        const [result1] = await db.query(`
            INSERT INTO combos (name, description, price, original_price, image_url, tag) VALUES
            ('Pickle Lovers Combo', 'Gongura + Avakaya + Tomato (250g each)', 799, 950, '/images/combo1.jpg', 'Most Popular'),
            ('Non-Veg Feast Combo', 'Chicken + Mutton + Prawns (250g each)', 1499, 1800, '/images/combo2.jpg', 'Value Deal'),
            ('Festival Sweet Box', 'Bobbatlu + Laddu + Ariselu (Special Box)', 899, 1100, '/images/combo3.jpg', 'Gifting Special')
        `);

        // Fetch some products to assign to combos
        const [products] = await db.query(`SELECT id FROM products LIMIT 3`);
        if (products.length > 0) {
            const pid = products[0].id; // Just use the first product for all combo items as dummy
            for (let i = 1; i <= 3; i++) {
                await db.query(`
                    INSERT INTO combo_items (combo_id, product_id, weight, quantity) VALUES
                    (?, ?, '250g', 1)
                `, [i, pid]);
            }
        }

        console.log('Migration successful.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrateCombos();
