const db = require('../config/db');

const fetchAllCombos = async () => {
    const [rows] = await db.query('SELECT * FROM combos');
    return rows;
};

const fetchComboById = async (id) => {
    const [rows] = await db.query('SELECT * FROM combos WHERE id = ?', [id]);
    if (rows.length === 0) throw new Error('Combo not found');
    const combo = rows[0];

    const [items] = await db.query(`
        SELECT ci.*, p.name as product_name, p.image_url as product_image
        FROM combo_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.combo_id = ?
    `, [id]);

    combo.items = items;
    return combo;
};

module.exports = {
    fetchAllCombos,
    fetchComboById
};
