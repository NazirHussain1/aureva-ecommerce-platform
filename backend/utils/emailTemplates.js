const emailHeader = () => `
  <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">✨ Aureva Beauty</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Your Premium Beauty Destination</p>
  </div>
`;

const emailFooter = () => `
  <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 30px;">
    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
      Need help? Contact us at <a href="mailto:support@aureva.com" style="color: #a855f7; text-decoration: none;">support@aureva.com</a>
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
      © ${new Date().getFullYear()} Aureva Beauty. All rights reserved.
    </p>
  </div>
`;

const welcomeEmailTemplate = (userName) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      ${emailHeader()}
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">Welcome to Aureva Beauty! 🎉</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${userName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for joining Aureva Beauty! We're thrilled to have you as part of our community. Get ready to discover premium beauty products that will help you look and feel your best.
        </p>
        
        <div style="background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%); padding: 25px; border-radius: 10px; margin: 30px 0;">
          <h3 style="color: #a855f7; font-size: 18px; margin: 0 0 15px 0;">🎁 Welcome Offer</h3>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
            As a welcome gift, enjoy <strong>10% OFF</strong> on your first order! Use code: <strong style="color: #a855f7;">WELCOME10</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Start Shopping
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
          If you have any questions, our support team is always here to help!
        </p>
      </div>
      
      ${emailFooter()}
    </div>
  </body>
  </html>
`;

const contactFormNotificationTemplate = (name, email, subject, message) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      ${emailHeader()}
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">📧 New Contact Message</h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>From:</strong></p>
          <p style="color: #111827; font-size: 16px; margin: 0 0 20px 0;">${name}</p>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Email:</strong></p>
          <p style="color: #111827; font-size: 16px; margin: 0 0 20px 0;">
            <a href="mailto:${email}" style="color: #a855f7; text-decoration: none;">${email}</a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Subject:</strong></p>
          <p style="color: #111827; font-size: 16px; margin: 0 0 20px 0;">${subject}</p>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Message:</strong></p>
          <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/contact-messages" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            View in Admin Panel
          </a>
        </div>
      </div>
      
      ${emailFooter()}
    </div>
  </body>
  </html>
`;

const contactFormAutoReplyTemplate = (userName) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      ${emailHeader()}
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">Thank You for Contacting Us! 💌</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${userName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          We've received your message and our team will get back to you within 24-48 hours. We appreciate your patience!
        </p>
        
        <div style="background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%); padding: 25px; border-radius: 10px; margin: 30px 0;">
          <h3 style="color: #a855f7; font-size: 18px; margin: 0 0 15px 0;">⏰ What's Next?</h3>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
            Our support team is reviewing your message and will respond to you shortly. In the meantime, feel free to browse our latest products!
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Browse Products
          </a>
        </div>
      </div>
      
      ${emailFooter()}
    </div>
  </body>
  </html>
`;

const orderConfirmationTemplate = (order, user) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0;">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      ${emailHeader()}
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">Order Confirmed! 🎉</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${user.name}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for your order! We're preparing your items for shipment.
        </p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Order Number:</strong></p>
          <p style="color: #a855f7; font-size: 24px; font-weight: bold; margin: 0 0 20px 0;">#${order.id}</p>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Total Amount:</strong></p>
          <p style="color: #111827; font-size: 20px; font-weight: bold; margin: 0;">$${Number(order.totalAmount).toFixed(2)}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Track Your Order
          </a>
        </div>
      </div>
      
      ${emailFooter()}
    </div>
  </body>
  </html>
`;

const orderStatusUpdateTemplate = (order, user, newStatus) => {
  const statusMessages = {
    processing: {
      title: 'Order is Being Processed',
      emoji: '⚙️',
      message: 'Your order is currently being processed and will be shipped soon.'
    },
    shipped: {
      title: 'Order Shipped!',
      emoji: '🚚',
      message: 'Great news! Your order has been shipped and is on its way to you.'
    },
    delivered: {
      title: 'Order Delivered!',
      emoji: '📦',
      message: 'Your order has been successfully delivered. We hope you love your products!'
    },
    cancelled: {
      title: 'Order Cancelled',
      emoji: '❌',
      message: 'Your order has been cancelled. If you have any questions, please contact our support team.'
    }
  };

  const status = statusMessages[newStatus] || statusMessages.processing;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${emailHeader()}
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">${status.emoji} ${status.title}</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi <strong>${user.name}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            ${status.message}
          </p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Order Number:</strong></p>
            <p style="color: #a855f7; font-size: 24px; font-weight: bold; margin: 0;">#${order.id}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" 
               style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View Order Details
            </a>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    </body>
    </html>
  `;
};

const passwordResetTemplate = (userName, resetToken) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      ${emailHeader()}
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">🔐 Password Reset Request</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${userName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          ⏰ This link will expire in <strong>1 hour</strong> for security reasons.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
      
      ${emailFooter()}
    </div>
  </body>
  </html>
`;

const newsletterTemplate = (userName, subject, content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      ${emailHeader()}
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">${subject}</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${userName}</strong>,
        </p>
        
        <div style="color: #374151; font-size: 16px; line-height: 1.6;">
          ${content}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Shop Now
          </a>
        </div>
      </div>
      
      ${emailFooter()}
    </div>
  </body>
  </html>
`;

module.exports = {
  welcomeEmailTemplate,
  contactFormNotificationTemplate,
  contactFormAutoReplyTemplate,
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  passwordResetTemplate,
  newsletterTemplate,
};
