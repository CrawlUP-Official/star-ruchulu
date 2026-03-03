const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getProductsByCategory,
    getProductsByRegion,
    searchForProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/search', searchForProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.get('/region/:region', getProductsByRegion);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
