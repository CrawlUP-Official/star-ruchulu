const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', customerController.signup);
router.post('/verify-signup', customerController.verifySignup);
router.post('/login', customerController.login);
router.post('/verify-login', customerController.verifyLogin);
router.get('/profile', authMiddleware, customerController.getProfile);
router.get('/orders', authMiddleware, customerController.getCustomerOrders);
router.get('/', customerController.getAllCustomers);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
