const subscriptionService = require('../services/subscriptionService');

const subscribe = async (req, res, next) => {
    try {
        const result = await subscriptionService.subscribeUser(req.body.email);
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes('already subscribed')) {
            res.status(409);
        } else {
            res.status(400);
        }
        next(error);
    }
};

const getSubscriptions = async (req, res, next) => {
    try {
        const subs = await subscriptionService.fetchAllSubscriptions();
        res.json(subs);
    } catch (error) {
        next(error);
    }
};

const deleteSubscription = async (req, res, next) => {
    try {
        const result = await subscriptionService.deleteSubscription(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = { subscribe, getSubscriptions, deleteSubscription };
