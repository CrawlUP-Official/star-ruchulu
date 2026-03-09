const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/status', updateOrderStatus);
router.delete('/:orderId', deleteOrder);
router.get('/:orderId/tracking', require('../controllers/orderController').getOrderTracking);

module.exports = router;
