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
        let { productData, weights } = req.body;

        // Parse from FormData strings
        if (typeof productData === 'string') productData = JSON.parse(productData);
        if (typeof weights === 'string') weights = JSON.parse(weights);

        if (req.file) {
            // we store the relative path or absolute path
            // to make sure it works seamlessly in frontend, we construct the backend url
            productData.image_url = 'http://localhost:5000/uploads/' + req.file.filename;
        }

        const id = await productService.createProduct(productData, weights);
        res.status(201).json({ success: true, id, message: 'Product created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { productData, weights } = req.body;

        if (typeof productData === 'string') productData = JSON.parse(productData);
        if (typeof weights === 'string') weights = JSON.parse(weights);

        if (req.file) {
            productData.image_url = 'http://localhost:5000/uploads/' + req.file.filename;
        }

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
