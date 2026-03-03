const Subscription = require('../models/subscriptionModel');

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

    return {
        success: true,
        message: "Subscription active! Use code WELCOME10",
        coupon_code: couponCode
    };
};

const fetchAllSubscriptions = async () => {
    return await Subscription.findAll();
};

module.exports = { subscribeUser, fetchAllSubscriptions };
