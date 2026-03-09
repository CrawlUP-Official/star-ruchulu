const db = require('../config/db');

const Subscription = {
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    },

    create: async (email, couponCode) => {
        const [result] = await db.query(
            'INSERT INTO subscriptions (email, coupon_code) VALUES (?, ?)',
            [email, couponCode]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM subscriptions ORDER BY created_at DESC');
        return rows;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM subscriptions WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Subscription;
