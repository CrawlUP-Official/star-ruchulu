const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const emailService = require('./emailService');

const createOrder = async (orderPayload) => {
    const { items, ...orderData } = orderPayload;

    if (!items || items.length === 0) {
        throw new Error('No order items provided');
    }

    if (!orderData.customer_name || !orderData.email || !orderData.phone) {
        throw new Error('Mandatory customer details missing');
    }

    // Mandatory server-side total recalculation to prevent client-side manipulation
    let calculatedTotal = 0;

    for (const item of items) {
        if (item.quantity <= 0) throw new Error('Quantity must be positive');

        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Invalid product ID: ${item.product_id}`);

        const validPrice = product.pricePerWeight[item.weight];
        if (validPrice === undefined) throw new Error(`Invalid weight ${item.weight} for product ${item.product_id}`);

        // Enforce correct price dynamically
        item.price = validPrice;
        calculatedTotal += (validPrice * item.quantity);
    }

    // Override total from client
    orderData.total_amount = calculatedTotal;

    // Delegate safely to Model for transactional database insert
    const savedOrder = await Order.create(orderData, items);

    // Send beautiful order confirmation email (fire and forget)
    emailService.sendOrderConfirmationEmail(orderData.email, {
        orderId: savedOrder.orderId,
        customerName: orderData.customer_name,
        items: items,
        totalAmount: calculatedTotal,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        pincode: orderData.pincode
    }).catch(err => {
        console.error('Order confirmation email failed:', err.message);
    });

    return {
        ...savedOrder,
        total_amount: calculatedTotal,
        message: 'Order Placed Successfully'
    };
};

const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    return order;
};

const fetchAllOrders = async () => {
    return await Order.findAll();
};

const updateOrderStatus = async (orderIdString, newStatus) => {
    if (!newStatus) throw new Error('New status is required');
    const order = await Order.findById(orderIdString);
    if (!order) throw new Error('Order not found');

    const updated = await Order.updateStatus(orderIdString, newStatus);
    if (!updated) throw new Error('Order not found or status invalid');

    // Dispatch tracking email
    emailService.sendOrderStatusEmail(order.email, order.order_id || orderIdString, newStatus).catch(err => {
        console.error('Order status email failed:', err.message);
    });

    return { success: true, message: `Order status updated to ${newStatus}` };
};

const deleteOrder = async (orderIdString) => {
    const deleted = await Order.delete(orderIdString);
    if (!deleted) throw new Error('Order not found');
    return { success: true, message: 'Order deleted successfully' };
};

const getOrderTracking = async (orderIdString) => {
    const order = await Order.findById(orderIdString);
    if (!order) throw new Error('Order not found');

    // Determine timeline based on current status
    return {
        orderId: order.order_id,
        currentStatus: order.order_status,
        updatedAt: order.created_at // Simulating timestamp for now
    };
};

module.exports = {
    createOrder,
    getOrderById,
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderTracking
};
