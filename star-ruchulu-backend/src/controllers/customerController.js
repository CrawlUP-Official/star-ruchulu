const customerService = require('../services/customerService');
const db = require('../config/db');

const signup = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const result = await customerService.signup({ name, email, password, phone });
        res.status(201).json({ success: true, ...result });
    } catch (error) {
        if (error.message === 'Email already exists') {
            return res.status(409).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await customerService.login(email, password);
        res.json({ success: true, ...result });
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const profile = await customerService.getProfile(req.user.id);
        res.json({ success: true, profile });
    } catch (error) {
        next(error);
    }
};

const getCustomerOrders = async (req, res, next) => {
    try {
        // Find order items and details
        const [orders] = await db.query(
            'SELECT o.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT("product_id", oi.product_id, "quantity", oi.quantity, "weight", oi.weight, "price", oi.price)) FROM order_items oi WHERE oi.order_ref = o.id) as items FROM orders o WHERE o.email = ? ORDER BY o.created_at DESC',
            [req.user.email]
        );
        res.json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

const getAllCustomers = async (req, res, next) => {
    try {
        // Admin only route
        const customers = await customerService.getAllCustomers();
        res.json({ success: true, customers });
    } catch (error) {
        next(error);
    }
};

const verifySignup = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await customerService.verifySignup({ email, otp });
        res.json({ success: true, ...result });
    } catch (error) {
        if (error.message === 'Invalid or expired OTP') {
            return res.status(401).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const verifyLogin = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await customerService.verifyLogin({ email, otp });
        res.json({ success: true, ...result });
    } catch (error) {
        if (error.message === 'Invalid or expired OTP') {
            return res.status(401).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const deleteCustomer = async (req, res, next) => {
    try {
        const result = await customerService.deleteCustomer(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    verifySignup,
    login,
    verifyLogin,
    getProfile,
    getCustomerOrders,
    getAllCustomers,
    deleteCustomer
};
