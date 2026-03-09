const Subscription = require('../models/subscriptionModel');
const emailService = require('./emailService');

const subscribeUser = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }

    // Detect duplicates
    const existingSub = await Subscription.findByEmail(email);
    if (existingSub) {
        throw new Error('Email is already subscribed');
    }

    const couponCode = 'WELCOME10';
    await Subscription.create(email, couponCode);

    // Send beautiful welcome email (fire and forget)
    emailService.sendWelcomeEmail(email, couponCode).catch(err => {
        console.error('Welcome email failed:', err.message);
    });

    return {
        success: true,
        message: "Subscription active! Use code WELCOME10",
        coupon_code: couponCode
    };
};

const fetchAllSubscriptions = async () => {
    return await Subscription.findAll();
};

const deleteSubscription = async (id) => {
    const deleted = await Subscription.delete(id);
    if (!deleted) throw new Error('Subscription not found');
    return { success: true, message: 'Subscription deleted successfully' };
};

module.exports = { subscribeUser, fetchAllSubscriptions, deleteSubscription };
