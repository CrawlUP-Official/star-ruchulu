const productService = require('../services/productService');

const getProducts = async (req, res, next) => {
    try {
        const products = await productService.fetchAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.fetchProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

const getProductsByCategory = async (req, res, next) => {
    try {
        const products = await productService.fetchProductsByCategory(req.params.category);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getProductsByRegion = async (req, res, next) => {
    try {
        const products = await productService.fetchProductsByRegion(req.params.region);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const searchForProducts = async (req, res, next) => {
    try {
        const products = await productService.searchProducts(req.query.q || '');
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { productData, weights } = req.body;
        const id = await productService.createProduct(productData, weights);
        res.status(201).json({ success: true, id, message: 'Product created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productData, weights } = req.body;
        await productService.updateProduct(id, productData, weights);
        res.status(200).json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductsByCategory,
    getProductsByRegion,
    searchForProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
