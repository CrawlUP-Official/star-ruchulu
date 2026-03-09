const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');
const db = require('../config/db');

const emailService = require('./emailService');
const otpGenerator = require('otp-generator');

const JWT_SECRET = process.env.JWT_SECRET || 'star_ruchulu_secret_key_2026';

const generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
};

const storeOTP = async (email, otp) => {
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes
    await db.query('INSERT INTO customer_otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt]);
};

const verifyOTP = async (email, otp) => {
    const [rows] = await db.query('SELECT * FROM customer_otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1', [email, otp]);
    if (rows.length === 0) {
        throw new Error('Invalid or expired OTP');
    }
    await db.query('DELETE FROM customer_otps WHERE email = ?', [email]);
    return true;
};

const signup = async (customerData) => {
    const existingCustomer = await Customer.findByEmail(customerData.email);
    if (existingCustomer) {
        throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = customerData.password ? await bcrypt.hash(customerData.password, salt) : null;

    // We don't create the user here, we just save the pending data (or we can create user and leave them unverified - lets do what is simpler: store in a temp table or just create them and assume the OTP verify is the actual login. The prompt says: "Customer enters email -> System generates OTP -> OTP emailed -> Customer enters OTP -> Account created".
    // We can use a pending table, or store data in OTP table. Let's store data in a session or pass it with verify.
    // Actually, creating user unverified is easiest or forcing to pass name/phone again on verify.
    // Let's create the user directly, but we don't issue token until OTP. Wait, prompt says OTP must be required for signup. 
    // Let's send the OTP first. We won't create the user until verifySignup.

    const otp = generateOTP();
    await storeOTP(customerData.email, otp);

    // Fire and forget email
    emailService.sendOTPEmail(customerData.email, otp).catch(console.error);

    // We return a message to verify
    return { message: 'OTP sent to email', email: customerData.email };
};

const verifySignup = async ({ name, email, password, phone, otp }) => {
    await verifyOTP(email, otp);

    // Now create user
    const salt = await bcrypt.genSalt(10);
    const password_hash = password ? await bcrypt.hash(password, salt) : null;

    const id = await Customer.create({
        name,
        email,
        phone,
        password_hash
    });

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, customer: { id, name, email } };
};

const login = async (email, password) => {
    const customer = await Customer.findByEmail(email);
    if (!customer) {
        throw new Error('Invalid email or password');
    }

    // Since passwords are optional if OTP login used, we can just jump to OTP.
    const otp = generateOTP();
    await storeOTP(email, otp);

    emailService.sendOTPEmail(email, otp).catch(console.error);

    return { message: 'OTP sent to email', email };
};

const verifyLogin = async ({ email, otp }) => {
    await verifyOTP(email, otp);

    const customer = await Customer.findByEmail(email);
    if (!customer) {
        throw new Error('Customer not found');
    }

    const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, customer: { id: customer.id, name: customer.name, email: customer.email } };
};

const getProfile = async (id) => {
    const customer = await Customer.findById(id);
    if (!customer) throw new Error('Customer not found');

    // Fetch subscription status
    const [sub] = await db.query('SELECT * FROM subscriptions WHERE email = ?', [customer.email]);

    // Fetch order history
    const [orders] = await db.query('SELECT id, order_id, total_amount, order_status, created_at FROM orders WHERE email = ? ORDER BY created_at DESC', [customer.email]);

    return {
        ...customer,
        is_subscribed: sub.length > 0,
        orders
    };
};

const getAllCustomers = async () => {
    return await Customer.findAll();
};

const deleteCustomer = async (id) => {
    return await Customer.delete(id);
};

module.exports = {
    signup,
    verifySignup,
    login,
    verifyLogin,
    getProfile,
    getAllCustomers,
    deleteCustomer
};
