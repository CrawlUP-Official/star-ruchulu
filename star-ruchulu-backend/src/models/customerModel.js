const db = require('../config/db');

const Customer = {
    create: async (customerData) => {
        const { name, email, password_hash, phone } = customerData;
        const [result] = await db.query(
            'INSERT INTO customers (name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, phone]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT id, name, email, phone, created_at FROM customers WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    findAll: async () => {
        const [rows] = await db.query(`
            SELECT c.id, c.name, c.email, c.phone, c.created_at, 
                   COUNT(o.id) as total_orders, 
                   COALESCE(SUM(o.total_amount), 0) as total_spend 
            FROM customers c 
            LEFT JOIN orders o ON c.email = o.email 
            GROUP BY c.id
        `);
        return rows;
    },

    delete: async (id) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [customers] = await connection.query('SELECT email FROM customers WHERE id = ?', [id]);
            if (customers.length === 0) {
                await connection.rollback();
                return false;
            }
            const email = customers[0].email;

            // Delete order items
            await connection.query('DELETE FROM order_items WHERE order_ref IN (SELECT id FROM orders WHERE email = ?)', [email]);
            // Delete orders
            await connection.query('DELETE FROM orders WHERE email = ?', [email]);
            // Delete OTPs
            await connection.query('DELETE FROM customer_otps WHERE email = ?', [email]);
            // Delete subscriptions
            await connection.query('DELETE FROM subscriptions WHERE email = ?', [email]);

            // Finally delete customer
            const [result] = await connection.query('DELETE FROM customers WHERE id = ?', [id]);

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

module.exports = Customer;
