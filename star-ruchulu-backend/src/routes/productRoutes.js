const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
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

// Use multer upload middleware, single file with form field 'image'
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
