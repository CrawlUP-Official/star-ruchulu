const { sendEmail } = require('./brevoEmailService');

// Beautiful welcome email template for new subscribers
const sendWelcomeEmail = async (email, couponCode) => {
    const subject = '🎉 Welcome to Star Ruchulu! Here\'s your 10% OFF coupon';
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a3c2a 0%, #2d5a3f 100%);padding:40px 30px;text-align:center;">
                <h1 style="color:#C6A75E;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:1px;">Star Ruchulu</h1>
                <p style="color:#a8c5b3;font-size:13px;margin:8px 0 0;letter-spacing:2px;text-transform:uppercase;">Premium Andhra Homemade Foods</p>
            </div>
            
            <!-- Content -->
            <div style="padding:40px 30px;">
                <h2 style="color:#1a3c2a;font-size:24px;margin:0 0 15px;font-family:Georgia,serif;">Welcome to the Family! 🙏</h2>
                <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 20px;">
                    Namaste! Thank you for subscribing to Star Ruchulu. You've just joined a community that celebrates authentic Andhra flavours, 
                    handcrafted with love from the kitchens of Palnadu.
                </p>
                
                <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 25px;">
                    From our famous pickles to traditional sweets and crispy snacks — every product is made with hand-picked ingredients 
                    and recipes passed down through generations.
                </p>

                <!-- Coupon Box -->
                <div style="background:linear-gradient(135deg,#f8f3e8 0%,#faf6ee 100%);border:2px dashed #C6A75E;border-radius:12px;padding:25px;text-align:center;margin:25px 0;">
                    <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Your Exclusive Coupon</p>
                    <div style="background:#1a3c2a;color:#C6A75E;font-size:32px;font-weight:bold;padding:12px 30px;border-radius:8px;display:inline-block;letter-spacing:3px;font-family:monospace;">
                        ${couponCode}
                    </div>
                    <p style="color:#1a3c2a;font-size:16px;font-weight:bold;margin:15px 0 5px;">Get 10% OFF on your first order!</p>
                    <p style="color:#888;font-size:12px;margin:0;">Apply this code at checkout</p>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin:30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" 
                       style="background:#1a3c2a;color:#ffffff;padding:14px 40px;text-decoration:none;border-radius:50px;font-weight:bold;font-size:15px;display:inline-block;letter-spacing:0.5px;">
                        Shop Now & Save 10%
                    </a>
                </div>

                <p style="color:#999;font-size:13px;line-height:1.6;text-align:center;">
                    We'll keep you updated with new products, special offers, and seasonal delicacies.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background:#f5f0e8;padding:25px 30px;text-align:center;border-top:1px solid #e8e0d0;">
                <p style="color:#1a3c2a;font-size:14px;font-weight:bold;margin:0 0 5px;font-family:Georgia,serif;">Star Ruchulu</p>
                <p style="color:#999;font-size:11px;margin:0;">Authentic Andhra Flavours • Handcrafted with Love</p>
                <p style="color:#bbb;font-size:10px;margin:10px 0 0;">© ${new Date().getFullYear()} Star Ruchulu. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    return sendEmail(email, subject, html);
};

// Order confirmation email template
const sendOrderConfirmationEmail = async (email, orderData) => {
    const { orderId, customerName, items, totalAmount, address, city, state, pincode } = orderData;

    const itemsHtml = (items || []).map(item => `
        <tr>
            <td style="padding:10px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">${item.name || 'Product'}</td>
            <td style="padding:10px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">${item.weight || '-'}</td>
            <td style="padding:10px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">${item.quantity || 1}</td>
            <td style="padding:10px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1a3c2a;font-weight:bold;text-align:right;">₹${parseFloat(item.price || 0).toLocaleString()}</td>
        </tr>
    `).join('');

    const subject = `✅ Order Confirmed! Your Star Ruchulu Order #${orderId}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1a3c2a 0%,#2d5a3f 100%);padding:40px 30px;text-align:center;">
                <h1 style="color:#C6A75E;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:1px;">Star Ruchulu</h1>
                <p style="color:#a8c5b3;font-size:13px;margin:8px 0 0;letter-spacing:2px;text-transform:uppercase;">Order Confirmation</p>
            </div>
            
            <!-- Content -->
            <div style="padding:35px 30px;">
                <!-- Success Badge -->
                <div style="text-align:center;margin-bottom:25px;">
                    <div style="background:#e8f5e9;width:60px;height:60px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px;">
                        <span style="font-size:30px;">✅</span>
                    </div>
                    <h2 style="color:#1a3c2a;font-size:22px;margin:0;font-family:Georgia,serif;">Order Confirmed!</h2>
                </div>

                <p style="color:#555;font-size:15px;line-height:1.7;">
                    Hi <strong>${customerName}</strong>, thank you for your order! We're preparing your authentic Andhra delicacies with care.
                </p>

                <!-- Order Info -->
                <div style="background:#f8f6f0;border-radius:10px;padding:18px;margin:20px 0;border-left:4px solid #C6A75E;">
                    <p style="margin:0;font-size:14px;color:#666;">Order Number</p>
                    <p style="margin:5px 0 0;font-size:20px;font-weight:bold;color:#1a3c2a;font-family:monospace;letter-spacing:1px;">${orderId}</p>
                </div>

                <!-- Items Table -->
                <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                    <thead>
                        <tr style="background:#f8f6f0;">
                            <th style="padding:10px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Item</th>
                            <th style="padding:10px;text-align:center;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Weight</th>
                            <th style="padding:10px;text-align:center;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                            <th style="padding:10px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding:12px 10px;text-align:right;font-weight:bold;font-size:15px;color:#1a3c2a;">Total:</td>
                            <td style="padding:12px 10px;text-align:right;font-weight:bold;font-size:18px;color:#1a3c2a;">₹${parseFloat(totalAmount).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                <!-- Delivery Address -->
                <div style="background:#f0f7f3;border-radius:10px;padding:18px;margin:20px 0;">
                    <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">📍 Delivery Address</p>
                    <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${address}<br>${city}, ${state} — ${pincode}</p>
                </div>

                <p style="color:#888;font-size:13px;line-height:1.7;margin:20px 0;">
                    🚚 Estimated delivery: <strong>5-7 business days</strong><br>
                    We'll send you a tracking update once your order ships.
                </p>

                <!-- Track Button -->
                <div style="text-align:center;margin:25px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                       style="background:#1a3c2a;color:#ffffff;padding:12px 35px;text-decoration:none;border-radius:50px;font-weight:bold;font-size:14px;display:inline-block;">
                        Visit Star Ruchulu
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background:#f5f0e8;padding:25px 30px;text-align:center;border-top:1px solid #e8e0d0;">
                <p style="color:#1a3c2a;font-size:14px;font-weight:bold;margin:0 0 5px;font-family:Georgia,serif;">Star Ruchulu</p>
                <p style="color:#999;font-size:11px;margin:0;">Authentic Andhra Flavours • Handcrafted with Love</p>
                <p style="color:#bbb;font-size:10px;margin:10px 0 0;">© ${new Date().getFullYear()} Star Ruchulu. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    return sendEmail(email, subject, html);
};

// OTP Email
const sendOTPEmail = async (email, otpCode) => {
    const subject = 'Your Star Ruchulu Login OTP';
    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
            <div style="background: linear-gradient(135deg, #1a3c2a 0%, #2d5a3f 100%);padding:40px 30px;text-align:center;">
                <h1 style="color:#C6A75E;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:1px;">Star Ruchulu</h1>
            </div>
            <div style="padding:40px 30px;">
                <h2 style="color:#1a3c2a;font-size:20px;margin:0 0 15px;font-family:Georgia,serif;">Hello from Star Ruchulu 🌿</h2>
                <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 20px;">
                    Your One-Time Password is:
                </p>
                <div style="background:#1a3c2a;color:#C6A75E;font-size:32px;font-weight:bold;padding:12px 30px;border-radius:8px;display:inline-block;letter-spacing:3px;font-family:monospace;">
                    ${otpCode}
                </div>
                <p style="color:#555;font-size:15px;line-height:1.7;margin:20px 0 25px;">
                    This OTP is valid for 10 minutes.
                </p>
                <p style="color:#999;font-size:13px;line-height:1.6;text-align:center;">
                    If you did not request this login, please ignore this message.
                </p>
                <p style="color:#999;font-size:13px;line-height:1.6;text-align:center;">
                    — Team Star Ruchulu
                </p>
            </div>
            <div style="background:#f5f0e8;padding:25px 30px;text-align:center;border-top:1px solid #e8e0d0;">
                <p style="color:#1a3c2a;font-size:14px;font-weight:bold;margin:0 0 5px;font-family:Georgia,serif;">Star Ruchulu</p>
                <p style="color:#bbb;font-size:10px;margin:10px 0 0;">© ${new Date().getFullYear()} Star Ruchulu. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
    return sendEmail(email, subject, html);
};

// Delivery Status Updates
const sendOrderStatusEmail = async (email, orderId, status) => {
    let subject = `Your Star Ruchulu Order is now ${status}`;
    let heading = `Order Status: ${status}`;
    let message = `We are currently processing your order #${orderId}.`;

    if (status === 'Shipped') {
        subject = 'Your Order Has Been Shipped';
        heading = 'Good news!';
        message = `Your Star Ruchulu order is now shipped 🚚<br/>Order ID: ${orderId}<br/>You can track delivery through your account.`;
    } else if (status === 'Delivered') {
        subject = 'Your Order Has Been Delivered';
        heading = 'Enjoy your Authentic Andhra Flavours!';
        message = `Your order #${orderId} has been delivered successfully. Thank you for your support!`;
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
            <div style="background: linear-gradient(135deg, #1a3c2a 0%, #2d5a3f 100%);padding:40px 30px;text-align:center;">
                <h1 style="color:#C6A75E;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:1px;">Star Ruchulu</h1>
            </div>
            <div style="padding:40px 30px;">
                <h2 style="color:#1a3c2a;font-size:24px;margin:0 0 15px;font-family:Georgia,serif;">${heading}</h2>
                <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 20px;">
                    ${message}
                </p>
                <p style="color:#555;font-size:15px;line-height:1.7;margin:20px 0 25px;">
                    Thank you for supporting authentic Andhra flavours!
                </p>
            </div>
            <div style="background:#f5f0e8;padding:25px 30px;text-align:center;border-top:1px solid #e8e0d0;">
                <p style="color:#1a3c2a;font-size:14px;font-weight:bold;margin:0 0 5px;font-family:Georgia,serif;">Star Ruchulu</p>
                <p style="color:#bbb;font-size:10px;margin:10px 0 0;">© ${new Date().getFullYear()} Star Ruchulu. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
    return sendEmail(email, subject, html);
};

module.exports = { sendEmail, sendWelcomeEmail, sendOrderConfirmationEmail, sendOTPEmail, sendOrderStatusEmail };
