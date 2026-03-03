const db = require('../config/db');

const Contact = {
    create: async (data) => {
        const { name, phone, email, message } = data;
        const [result] = await db.query(
            'INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)',
            [name, phone, email, message]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        return rows;
    }
};

module.exports = Contact;
