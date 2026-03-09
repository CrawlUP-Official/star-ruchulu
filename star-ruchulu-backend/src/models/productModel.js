const db = require('../config/db');

const Product = {
    findAll: async () => {
        // Left join with product_weights to get all variations
        const [rows] = await db.query(`
      SELECT p.*, pw.weight, pw.price 
      FROM products p 
      LEFT JOIN product_weights pw ON p.id = pw.product_id
    `);

        // Group them logically so each product has a pricePerWeight object like frontend needs
        return groupProducts(rows);
    },

    findById: async (id) => {
        const [rows] = await db.query(`
      SELECT p.*, pw.weight, pw.price 
      FROM products p 
      LEFT JOIN product_weights pw ON p.id = pw.product_id 
      WHERE p.id = ?
    `, [id]);

        const products = groupProducts(rows);
        return products.length > 0 ? products[0] : null;
    },

    findByCategory: async (category) => {
        const [rows] = await db.query(`
      SELECT p.*, pw.weight, pw.price 
      FROM products p 
      LEFT JOIN product_weights pw ON p.id = pw.product_id 
      WHERE p.category = ?
    `, [category]);

        return groupProducts(rows);
    },

    findByRegion: async (region) => {
        const [rows] = await db.query(`
      SELECT p.*, pw.weight, pw.price 
      FROM products p 
      LEFT JOIN product_weights pw ON p.id = pw.product_id 
      WHERE p.region = ?
    `, [region]);

        return groupProducts(rows);
    },

    search: async (queryStr) => {
        const q = '%' + queryStr + '%';
        const [rows] = await db.query(`
      SELECT p.*, pw.weight, pw.price 
      FROM products p 
      LEFT JOIN product_weights pw ON p.id = pw.product_id 
      WHERE p.name LIKE ? OR p.category LIKE ? OR p.region LIKE ?
    `, [q, q, q]);

        return groupProducts(rows);
    },

    create: async (productData, weights) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { name, category, region, spice_level, image_url, shelf_life, storage, is_best_seller } = productData;

            const [result] = await connection.query(
                'INSERT INTO products (name, category, region, spice_level, image_url, shelf_life, storage, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, category, region, spice_level, image_url, shelf_life, storage, is_best_seller || false]
            );

            const productId = result.insertId;

            if (weights && weights.length > 0) {
                for (const w of weights) {
                    await connection.query(
                        'INSERT INTO product_weights (product_id, weight, price) VALUES (?, ?, ?)',
                        [productId, w.weight, w.price]
                    );
                }
            }

            await connection.commit();
            return productId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, productData, weights) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { name, category, region, spice_level, image_url, shelf_life, storage, is_best_seller } = productData;

            await connection.query(
                'UPDATE products SET name = ?, category = ?, region = ?, spice_level = ?, image_url = ?, shelf_life = ?, storage = ?, is_best_seller = ? WHERE id = ?',
                [name, category, region, spice_level, image_url, shelf_life, storage, is_best_seller || false, id]
            );

            if (weights && weights.length > 0) {
                // Remove old weights
                await connection.query('DELETE FROM product_weights WHERE product_id = ?', [id]);
                // Insert new weights
                for (const w of weights) {
                    await connection.query(
                        'INSERT INTO product_weights (product_id, weight, price) VALUES (?, ?, ?)',
                        [id, w.weight, w.price]
                    );
                }
            }

            await connection.commit();
            return id;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    delete: async (id) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('DELETE FROM product_weights WHERE product_id = ?', [id]);
            await connection.query('DELETE FROM order_items WHERE product_id = ?', [id]);
            await connection.query('DELETE FROM combo_items WHERE product_id = ?', [id]);
            const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

// Helper function to group sql rows into product objects with a pricePerWeight map
function groupProducts(rows) {
    const map = new Map();
    rows.forEach(row => {
        if (!map.has(row.id)) {
            map.set(row.id, {
                id: row.id,
                name: row.name,
                category: row.category,
                region: row.region,
                spiceLevel: row.spice_level,
                image: row.image_url,
                shelfLife: row.shelf_life,
                storage: row.storage,
                isBestSeller: Boolean(row.is_best_seller),
                pricePerWeight: {}
            });
        }

        if (row.weight && row.price) {
            map.get(row.id).pricePerWeight[row.weight] = parseFloat(row.price);
        }
    });

    return Array.from(map.values());
}

module.exports = Product;
