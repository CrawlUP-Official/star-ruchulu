const db = require('../config/db');

const Order = {
    create: async (orderData, items) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Generate Order ID: SR-YYYY-XXXX
            const currentYear = new Date().getFullYear();
            const [countRows] = await connection.query('SELECT COUNT(*) as count FROM orders WHERE YEAR(created_at) = ?', [currentYear]);
            const nextCount = countRows[0].count + 1;
            const orderIdStr = `SR-${currentYear}-${String(nextCount).padStart(4, '0')}`;

            const { customer_name, phone, email, address, city, state, pincode, total_amount, payment_method } = orderData;

            // 2. Insert Order
            const [orderResult] = await connection.query(
                `INSERT INTO orders 
          (order_id, customer_name, phone, email, address, city, state, pincode, total_amount, payment_method, payment_status, order_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Processing')`,
                [orderIdStr, customer_name, phone, email, address, city, state, pincode, total_amount, payment_method]
            );

            const orderRef = orderResult.insertId;

            // 3. Insert Items
            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (order_ref, product_id, weight, quantity, price) VALUES (?, ?, ?, ?, ?)',
                    [orderRef, item.product_id, item.weight, item.quantity, item.price]
                );
            }

            await connection.commit();
            return { id: orderRef, orderId: orderIdStr };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    findById: async (orderIdString) => {
        const [orders] = await db.query('SELECT * FROM orders WHERE order_id = ?', [orderIdString]);
        if (orders.length === 0) return null;

        const order = orders[0];
        const [items] = await db.query(`
      SELECT oi.*, p.name, p.image_url 
      FROM order_items oi 
      LEFT JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_ref = ?
    `, [order.id]);

        order.items = items;
        return order;
    },

    findAll: async () => {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');

        // Optionally fetch items for each order or just return the base order list
        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.*, p.name, p.image_url 
                FROM order_items oi 
                LEFT JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_ref = ?
            `, [order.id]);
            order.items = items;
        }

        return orders;
    },

    updateStatus: async (orderIdString, newStatus) => {
        const [result] = await db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [newStatus, orderIdString]);
        return result.affectedRows > 0;
    },

    delete: async (orderIdString) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [orders] = await connection.query('SELECT id FROM orders WHERE order_id = ?', [orderIdString]);
            if (orders.length === 0) {
                await connection.rollback();
                return false;
            }
            const orderRef = orders[0].id;

            await connection.query('DELETE FROM order_items WHERE order_ref = ?', [orderRef]);
            const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [orderRef]);

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

module.exports = Order;
