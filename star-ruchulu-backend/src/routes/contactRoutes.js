const express = require('express');
const router = express.Router();
const { registerContact, getContacts } = require('../controllers/contactController');

router.post('/', registerContact);
router.get('/', getContacts);

module.exports = router;
