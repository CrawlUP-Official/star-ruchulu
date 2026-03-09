const express = require('express');
const router = express.Router();
const { subscribe, getSubscriptions, deleteSubscription } = require('../controllers/subscriptionController');

router.post('/', subscribe);
router.get('/', getSubscriptions);
router.delete('/:id', deleteSubscription);

module.exports = router;
