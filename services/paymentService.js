const Payment = require('../models/Payment');
const Order = require('../models/Order');
const MerchantAccount = require('../models/MerchantAccount');
const User = require('../models/User');
const NotificationService = require('./notificationService');
const { sendEmail } = require('../config/email');

class PaymentService {
  // Create payment for order
  static async createPayment(orderId, userId, paymentData) {
    try {
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.UserId !== userId) {
        throw new Error('Unauthorized access to order');
      }

      // Get primary merchant account for the payment method
      let merchantAccount = null;
      if (paymentData.paymentMethod !== 'cash_on_delivery') {
        merchantAccount = await MerchantAccount.findOne({
          where: {
            accountType: paymentData.paymentMethod === 'bank_transfer' ? 'bank_account' : paymentData.paymentMethod,
            isActive: true,
            isVerified: true,
            isPrimary: true
          }
        });

        if (!merchantAccount) {
          throw new Error(`No active merchant account found for ${paymentData.paymentMethod}`);
        }
      }

      // Create payment record
      const payment = await Payment.create({
        OrderId: orderId,
        UserId: userId,
        MerchantAccountId: merchantAccount ? merchantAccount.id : null,
        paymentMethod: paymentData.paymentMethod,
        amount: order.totalAmount,
        status: paymentData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'processing',
        senderName: paymentData.senderName,
        senderAccount: paymentData.senderAccount,
        receiverAccount: merchantAccount ? merchantAccount.accountNumber : null,
        transactionId: paymentData.transactionId,
        paymentProof: paymentData.paymentProof || null,
        paymentDate: new Date(),
        notes: paymentData.notes
      });

      // Update order payment status
      await order.update({
        paymentStatus: paymentData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
        paymentMethod: paymentData.paymentMethod
      });

      // Send notification to admin for verification
      if (paymentData.paymentMethod !== 'cash_on_delivery') {
        await this.notifyAdminForVerification(payment, order);
      }

      // Send confirmation to customer
      await this.sendPaymentConfirmationEmail(payment, order, userId);

      return {
        payment,
        merchantAccount: merchantAccount ? {
          accountType: merchantAccount.accountType,
          accountTitle: merchantAccount.accountTitle,
          accountNumber: merchantAccount.accountNumber,
          bankName: merchantAccount.bankName,
          iban: merchantAccount.iban
        } : null
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Verify payment (Admin only)
  static async verifyPayment(paymentId, adminId, status, notes = null) {
    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [
          { model: Order },
          { model: User }
        ]
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Update payment status
      await payment.update({
        status: status,
        verifiedDate: new Date(),
        verifiedBy: adminId,
        notes: notes || payment.notes
      });

      // Update order payment status
      if (status === 'completed') {
        await payment.Order.update({
          paymentStatus: 'paid',
          orderStatus: 'processing'
        });

        // Send success notification to customer
        await NotificationService.createNotification(
          payment.UserId,
          'system',
          'Payment Verified',
          `Your payment of Rs. ${payment.amount} has been verified. Your order is now being processed.`,
          { paymentId: payment.id, orderId: payment.OrderId }
        );

        // Send email
        await this.sendPaymentVerifiedEmail(payment);
      } else if (status === 'failed') {
        await payment.Order.update({
          paymentStatus: 'failed'
        });

        // Send failure notification
        await NotificationService.createNotification(
          payment.UserId,
          'system',
          'Payment Verification Failed',
          `Your payment verification failed. Please contact support or try again.`,
          { paymentId: payment.id, orderId: payment.OrderId }
        );
      }

      return payment;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Get merchant accounts for payment
  static async getActiveMerchantAccounts() {
    try {
      const accounts = await MerchantAccount.findAll({
        where: {
          isActive: true,
          isVerified: true
        },
        order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']]
      });

      return accounts.map(account => ({
        id: account.id,
        accountType: account.accountType,
        accountTitle: account.accountTitle,
        accountNumber: account.accountNumber,
        bankName: account.bankName,
        branchCode: account.branchCode,
        iban: account.iban,
        isPrimary: account.isPrimary
      }));
    } catch (error) {
      console.error('Error fetching merchant accounts:', error);
      throw error;
    }
  }

  // Get payment by order ID
  static async getPaymentByOrderId(orderId, userId) {
    try {
      const payment = await Payment.findOne({
        where: { OrderId: orderId, UserId: userId },
        include: [
          { model: MerchantAccount, attributes: ['accountType', 'accountTitle', 'accountNumber'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Refund payment
  static async refundPayment(paymentId, adminId, reason) {
    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [{ model: Order }, { model: User }]
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'completed') {
        throw new Error('Only completed payments can be refunded');
      }

      await payment.update({
        status: 'refunded',
        refundReason: reason,
        refundDate: new Date(),
        verifiedBy: adminId
      });

      // Update order status
      await payment.Order.update({
        paymentStatus: 'refunded',
        orderStatus: 'cancelled'
      });

      // Notify customer
      await NotificationService.createNotification(
        payment.UserId,
        'system',
        'Payment Refunded',
        `Your payment of Rs. ${payment.amount} has been refunded. Reason: ${reason}`,
        { paymentId: payment.id, orderId: payment.OrderId }
      );

      return payment;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  // Send notification to admin for payment verification
  static async notifyAdminForVerification(payment, order) {
    try {
      const admins = await User.findAll({ where: { role: 'admin' } });
      
      for (const admin of admins) {
        await NotificationService.createNotification(
          admin.id,
          'system',
          'New Payment Pending Verification',
          `Payment of Rs. ${payment.amount} for Order #${order.id} needs verification.`,
          { 
            paymentId: payment.id, 
            orderId: order.id,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId
          }
        );
      }
    } catch (error) {
      console.error('Error notifying admin:', error);
    }
  }

  // Send payment confirmation email to customer
  static async sendPaymentConfirmationEmail(payment, order, userId) {
    try {
      const user = await User.findByPk(userId);
      
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Received! 💰</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name}!</h2>
                    <p>We have received your payment information for Order #${order.id}.</p>
                    
                    <div class="info-box">
                        <h3>Payment Details</h3>
                        <p><strong>Amount:</strong> Rs. ${payment.amount}</p>
                        <p><strong>Payment Method:</strong> ${payment.paymentMethod.toUpperCase()}</p>
                        <p><strong>Transaction ID:</strong> ${payment.transactionId || 'N/A'}</p>
                        <p><strong>Status:</strong> ${payment.status === 'cash_on_delivery' ? 'Pending (COD)' : 'Pending Verification'}</p>
                    </div>
                    
                    ${payment.paymentMethod !== 'cash_on_delivery' ? `
                    <p>Your payment is currently being verified by our team. You will receive a confirmation once it's verified.</p>
                    <p>This usually takes 1-2 hours during business hours.</p>
                    ` : `
                    <p>You have selected Cash on Delivery. Please keep the exact amount ready when your order arrives.</p>
                    `}
                </div>
                <div class="footer">
                    <p>Thank you for shopping with Aureva Beauty Shop!</p>
                    <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await sendEmail({
        email: user.email,
        subject: `Payment Received - Order #${order.id}`,
        html: emailTemplate
      });
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
    }
  }

  // Send payment verified email
  static async sendPaymentVerifiedEmail(payment) {
    try {
      const user = await User.findByPk(payment.UserId);
      const order = await Order.findByPk(payment.OrderId);
      
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-badge { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Verified! ✅</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name}!</h2>
                    
                    <div style="text-align: center;">
                        <span class="success-badge">Payment Confirmed</span>
                    </div>
                    
                    <p>Great news! Your payment of <strong>Rs. ${payment.amount}</strong> has been verified successfully.</p>
                    
                    <p><strong>Order #${order.id}</strong> is now being processed and will be shipped soon.</p>
                    
                    <p>You will receive another email when your order is shipped.</p>
                </div>
                <div class="footer">
                    <p>Thank you for shopping with Aureva Beauty Shop!</p>
                    <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await sendEmail({
        email: user.email,
        subject: `Payment Verified - Order #${order.id}`,
        html: emailTemplate
      });
    } catch (error) {
      console.error('Error sending payment verified email:', error);
    }
  }
}

module.exports = PaymentService;