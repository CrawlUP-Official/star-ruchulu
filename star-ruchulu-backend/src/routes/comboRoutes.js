const express = require('express');
const router = express.Router();
const { getCombos, getComboById } = require('../controllers/comboController');

router.get('/', getCombos);
router.get('/:id', getComboById);

module.exports = router;
