const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
