const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// API Routes mounting
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/subscribe', subscriptionRoutes);

// Fallback & Error Catchers
app.use(notFound);
app.use(errorHandler);

module.exports = app;