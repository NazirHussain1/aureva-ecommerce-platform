const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Aureva Beauty Shop! 💄</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Welcome to Aureva Beauty Shop - your ultimate destination for premium beauty products!</p>
                <p>We're thrilled to have you join our beauty community. Get ready to discover amazing skincare, makeup, and wellness products that will enhance your natural beauty.</p>
                <p>Here's what you can expect:</p>
                <ul>
                    <li>✨ Premium beauty products from top brands</li>
                    <li>🎁 Exclusive offers and discounts</li>
                    <li>💝 Personalized product recommendations</li>
                    <li>🚚 Fast and secure delivery</li>
                </ul>
                <a href="#" class="button">Start Shopping</a>
                <p>If you have any questions, our customer support team is here to help!</p>
            </div>
            <div class="footer">
                <p>Thank you for choosing Aureva Beauty Shop</p>
                <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const orderConfirmationTemplate = (order, user) => {
  const itemsHtml = order.items?.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
    </tr>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .total { font-size: 18px; font-weight: bold; color: #4CAF50; text-align: right; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmed! 🎉</h1>
                <p>Order #${order.id}</p>
            </div>
            <div class="content">
                <h2>Thank you for your order, ${user.name}!</h2>
                <p>We've received your order and it's being processed. You'll receive another email when your order ships.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th style="text-align: center;">Quantity</th>
                                <th style="text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    
                    <div class="total">
                        Total: $${order.totalAmount}
                    </div>
                </div>
                
                <h3>Shipping Address</h3>
                <p>
                    ${order.shippingAddress?.name || user.name}<br>
                    ${order.shippingAddress?.addressLine1}<br>
                    ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}
                </p>
            </div>
            <div class="footer">
                <p>Questions about your order? Contact our support team!</p>
                <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const orderStatusUpdateTemplate = (order, user, newStatus) => {
  const statusMessages = {
    processing: "Your order is being processed",
    shipped: "Your order has been shipped! 🚚",
    delivered: "Your order has been delivered! 📦",
    cancelled: "Your order has been cancelled"
  };

  const statusColors = {
    processing: "#ff9800",
    shipped: "#2196F3",
    delivered: "#4CAF50",
    cancelled: "#f44336"
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusColors[newStatus]}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; background: ${statusColors[newStatus]}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Status Update</h1>
                <p>Order #${order.id}</p>
            </div>
            <div class="content">
                <h2>Hello ${user.name}!</h2>
                <p>We have an update on your order:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span class="status-badge">${statusMessages[newStatus]}</span>
                </div>
                
                <p><strong>Order ID:</strong> #${order.id}</p>
                <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
                <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
                
                ${newStatus === 'delivered' ? `
                    <p>🎉 <strong>Congratulations!</strong> Your order has been successfully delivered. We hope you love your new beauty products!</p>
                    <p>Don't forget to leave a review and share your experience with other beauty enthusiasts.</p>
                ` : ''}
                
                ${newStatus === 'shipped' ? `
                    <p>📦 Your order is on its way! You should receive it within 2-5 business days.</p>
                ` : ''}
            </div>
            <div class="footer">
                <p>Thank you for shopping with Aureva Beauty Shop!</p>
                <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const passwordResetTemplate = (name, resetToken) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9C27B0, #BA68C8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #9C27B0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request 🔐</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>We received a request to reset your password for your Aureva Beauty Shop account.</p>
                
                <p>Click the button below to reset your password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" class="button">Reset Password</a>
                
                <div class="warning">
                    <p><strong>⚠️ Important:</strong></p>
                    <ul>
                        <li>This link will expire in 1 hour</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Never share this link with anyone</li>
                    </ul>
                </div>
                
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${process.env.FRONTEND_URL}/reset-password/${resetToken}</p>
            </div>
            <div class="footer">
                <p>If you have any questions, contact our support team</p>
                <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const newsletterTemplate = (name, subject, content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E91E63, #F06292); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #E91E63; }
            .button { display: inline-block; background: #E91E63; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .unsubscribe { color: #999; font-size: 11px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💄 Aureva Beauty Newsletter</h1>
                <p>${subject}</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                
                <div class="highlight">
                    ${content}
                </div>
                
                <a href="#" class="button">Shop Now</a>
                
                <p>Stay beautiful and keep glowing! ✨</p>
            </div>
            <div class="footer">
                <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
                <p class="unsubscribe">
                    <a href="#" style="color: #999;">Unsubscribe</a> | 
                    <a href="#" style="color: #999;">Update Preferences</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  passwordResetTemplate,
  newsletterTemplate,
};