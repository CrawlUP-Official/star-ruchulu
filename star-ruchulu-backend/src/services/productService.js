const Product = require('../models/productModel');

const fetchAllProducts = async () => {
    return await Product.findAll();
};

const fetchProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
};

const fetchProductsByCategory = async (category) => {
    return await Product.findByCategory(category);
};

const fetchProductsByRegion = async (region) => {
    return await Product.findByRegion(region);
};

const searchProducts = async (query) => {
    return await Product.search(query);
};

const createProduct = async (productData, weights) => {
    return await Product.create(productData, weights);
};

const updateProduct = async (id, productData, weights) => {
    return await Product.update(id, productData, weights);
};

const deleteProduct = async (id) => {
    return await Product.delete(id);
};

module.exports = {
    fetchAllProducts,
    fetchProductById,
    fetchProductsByCategory,
    fetchProductsByRegion,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
