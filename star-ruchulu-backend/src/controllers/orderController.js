const orderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
    try {
        const result = await orderService.createOrder(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400); // Bad Request (manipulated prices, invalid data, missing items)
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.orderId);
        res.json(order);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const orders = await orderService.fetchAllOrders();
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const result = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getOrders,
    updateOrderStatus
};
