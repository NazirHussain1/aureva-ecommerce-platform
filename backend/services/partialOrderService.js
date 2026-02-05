const OrderItemReturn = require('../models/OrderItemReturn');
const OrderItemCancellation = require('../models/OrderItemCancellation');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const NotificationService = require('./notificationService');

class PartialOrderService {
  // Request partial cancellation
  static async requestPartialCancellation(orderId, userId, cancellationData) {
    try {
      const order = await Order.findByPk(orderId);
      
      if (!order || order.UserId !== userId) {
        throw new Error('Order not found or unauthorized');
      }

      if (!['placed', 'processing'].includes(order.orderStatus)) {
        throw new Error('Order cannot be partially cancelled at this stage');
      }

      const orderItem = await OrderItem.findOne({
        where: { id: cancellationData.orderItemId, OrderId: orderId }
      });

      if (!orderItem) {
        throw new Error('Order item not found');
      }

      if (cancellationData.quantity > orderItem.quantity) {
        throw new Error('Cancellation quantity exceeds ordered quantity');
      }

      // Calculate refund amount
      const refundAmount = orderItem.price * cancellationData.quantity;

      // Create cancellation request
      const cancellation = await OrderItemCancellation.create({
        OrderItemId: orderItem.id,
        OrderId: orderId,
        quantity: cancellationData.quantity,
        reason: cancellationData.reason,
        reasonDetails: cancellationData.reasonDetails,
        refundAmount,
        status: 'requested'
      });

      // Notify admin
      await this.notifyAdminCancellation(order, orderItem, cancellation);

      return cancellation;
    } catch (error) {
      console.error('Error requesting partial cancellation:', error);
      throw error;
    }
  }

  // Request partial return
  static async requestPartialReturn(orderId, userId, returnData) {
    try {
      const order = await Order.findByPk(orderId);
      
      if (!order || order.UserId !== userId) {
        throw new Error('Order not found or unauthorized');
      }

      if (order.orderStatus !== 'delivered') {
        throw new Error('Only delivered orders can be returned');
      }

      // Check return window (10 days)
      const deliveredAt = new Date(order.deliveredAt);
      const now = new Date();
      const diffDays = Math.floor((now - deliveredAt) / (1000 * 60 * 60 * 24));

      if (diffDays > 10) {
        throw new Error('Return period expired (10 days from delivery)');
      }

      const orderItem = await OrderItem.findOne({
        where: { id: returnData.orderItemId, OrderId: orderId }
      });

      if (!orderItem) {
        throw new Error('Order item not found');
      }

      if (returnData.quantity > orderItem.quantity) {
        throw new Error('Return quantity exceeds ordered quantity');
      }

      // Calculate refund amount
      const refundAmount = orderItem.price * returnData.quantity;

      // Create return request
      const returnRequest = await OrderItemReturn.create({
        OrderItemId: orderItem.id,
        OrderId: orderId,
        quantity: returnData.quantity,
        reason: returnData.reason,
        reasonDetails: returnData.reasonDetails,
        refundAmount,
        images: returnData.images || [],
        status: 'requested'
      });

      // Notify admin
      await this.notifyAdminReturn(order, orderItem, returnRequest);

      return returnRequest;
    } catch (error) {
      console.error('Error requesting partial return:', error);
      throw error;
    }
  }

  // Approve cancellation (Admin)
  static async approveCancellation(cancellationId, adminId, notes) {
    try {
      const cancellation = await OrderItemCancellation.findByPk(cancellationId, {
        include: [
          { model: OrderItem, include: [{ model: Product }] },
          { model: Order }
        ]
      });

      if (!cancellation) {
        throw new Error('Cancellation request not found');
      }

      // Update cancellation status
      await cancellation.update({
        status: 'approved',
        approvedBy: adminId,
        approvedDate: new Date(),
        adminNotes: notes
      });

      // Restore product stock
      const product = cancellation.OrderItem.Product;
      await product.update({
        stock: product.stock + cancellation.quantity
      });

      // Update order item quantity
      const orderItem = cancellation.OrderItem;
      const newQuantity = orderItem.quantity - cancellation.quantity;
      
      if (newQuantity === 0) {
        await orderItem.destroy();
      } else {
        await orderItem.update({ quantity: newQuantity });
      }

      // Update order total
      const order = cancellation.Order;
      await order.update({
        totalAmount: order.totalAmount - cancellation.refundAmount
      });

      // Notify customer
      await NotificationService.createNotification(
        order.UserId,
        'system',
        'Cancellation Approved',
        `Your partial cancellation request has been approved. Refund: Rs. ${cancellation.refundAmount}`,
        { cancellationId: cancellation.id, orderId: order.id }
      );

      return cancellation;
    } catch (error) {
      console.error('Error approving cancellation:', error);
      throw error;
    }
  }

  // Approve return (Admin)
  static async approveReturn(returnId, adminId, notes) {
    try {
      const returnRequest = await OrderItemReturn.findByPk(returnId, {
        include: [
          { model: OrderItem, include: [{ model: Product }] },
          { model: Order }
        ]
      });

      if (!returnRequest) {
        throw new Error('Return request not found');
      }

      // Update return status
      await returnRequest.update({
        status: 'approved',
        approvedBy: adminId,
        approvedDate: new Date(),
        adminNotes: notes
      });

      // Notify customer
      await NotificationService.createNotification(
        returnRequest.Order.UserId,
        'system',
        'Return Approved',
        `Your return request has been approved. Please ship the items back.`,
        { returnId: returnRequest.id, orderId: returnRequest.Order.id }
      );

      return returnRequest;
    } catch (error) {
      console.error('Error approving return:', error);
      throw error;
    }
  }

  // Mark return as received and refund (Admin)
  static async processReturnRefund(returnId, adminId) {
    try {
      const returnRequest = await OrderItemReturn.findByPk(returnId, {
        include: [
          { model: OrderItem, include: [{ model: Product }] },
          { model: Order }
        ]
      });

      if (!returnRequest) {
        throw new Error('Return request not found');
      }

      if (returnRequest.status !== 'approved' && returnRequest.status !== 'received') {
        throw new Error('Return must be approved first');
      }

      // Update return status
      await returnRequest.update({
        status: 'refunded',
        refundedDate: new Date()
      });

      // Restore product stock
      const product = returnRequest.OrderItem.Product;
      await product.update({
        stock: product.stock + returnRequest.quantity
      });

      // Notify customer
      await NotificationService.createNotification(
        returnRequest.Order.UserId,
        'system',
        'Return Refunded',
        `Your return has been processed. Refund: Rs. ${returnRequest.refundAmount}`,
        { returnId: returnRequest.id, orderId: returnRequest.Order.id }
      );

      return returnRequest;
    } catch (error) {
      console.error('Error processing return refund:', error);
      throw error;
    }
  }

  // Get user's cancellation/return requests
  static async getUserRequests(userId, type = 'all') {
    try {
      let cancellations = [];
      let returns = [];

      if (type === 'all' || type === 'cancellation') {
        cancellations = await OrderItemCancellation.findAll({
          include: [
            {
              model: Order,
              where: { UserId: userId },
              attributes: ['id', 'totalAmount', 'orderStatus']
            },
            {
              model: OrderItem,
              include: [{ model: Product, attributes: ['name', 'images'] }]
            }
          ],
          order: [['createdAt', 'DESC']]
        });
      }

      if (type === 'all' || type === 'return') {
        returns = await OrderItemReturn.findAll({
          include: [
            {
              model: Order,
              where: { UserId: userId },
              attributes: ['id', 'totalAmount', 'orderStatus']
            },
            {
              model: OrderItem,
              include: [{ model: Product, attributes: ['name', 'images'] }]
            }
          ],
          order: [['createdAt', 'DESC']]
        });
      }

      return { cancellations, returns };
    } catch (error) {
      console.error('Error getting user requests:', error);
      throw error;
    }
  }

  // Notify admin about cancellation
  static async notifyAdminCancellation(order, orderItem, cancellation) {
    try {
      const admins = await User.findAll({ where: { role: 'admin' } });
      
      for (const admin of admins) {
        await NotificationService.createNotification(
          admin.id,
          'system',
          'Partial Cancellation Request',
          `Order #${order.id} - ${cancellation.quantity}x ${orderItem.Product?.name || 'item'} cancellation requested`,
          { cancellationId: cancellation.id, orderId: order.id }
        );
      }
    } catch (error) {
      console.error('Error notifying admin:', error);
    }
  }

  // Notify admin about return
  static async notifyAdminReturn(order, orderItem, returnRequest) {
    try {
      const admins = await User.findAll({ where: { role: 'admin' } });
      
      for (const admin of admins) {
        await NotificationService.createNotification(
          admin.id,
          'system',
          'Partial Return Request',
          `Order #${order.id} - ${returnRequest.quantity}x ${orderItem.Product?.name || 'item'} return requested`,
          { returnId: returnRequest.id, orderId: order.id }
        );
      }
    } catch (error) {
      console.error('Error notifying admin:', error);
    }
  }
}

module.exports = PartialOrderService;