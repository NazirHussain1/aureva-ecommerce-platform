const Notification = require("../models/Notification");

class NotificationService {
  static async createNotification(userId, title, message, type, actionUrl = null, metadata = null) {
    try {
      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        actionUrl,
        metadata,
      });
      return notification;
    } catch (error) {
      console.error("Create notification error:", error);
    }
  }

  static async createOrderStatusNotification(userId, orderId, status) {
    const statusMessages = {
      placed: "Your order has been placed successfully",
      processing: "Your order is being processed",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
      returned: "Your return request has been processed",
    };

    const title = `Order #${orderId} ${status}`;
    const message = statusMessages[status] || `Order status updated to ${status}`;

    return this.createNotification(
      userId,
      title,
      message,
      "order",
      `/orders/${orderId}`,
      { orderId, status }
    );
  }

  static async createPaymentNotification(userId, paymentId, status, amount) {
    const statusMessages = {
      completed: `Payment of $${amount} completed successfully`,
      failed: `Payment of $${amount} failed`,
      refunded: `Refund of $${amount} processed`,
    };

    const title = `Payment ${status}`;
    const message = statusMessages[status] || `Payment status: ${status}`;

    return this.createNotification(
      userId,
      title,
      message,
      "payment",
      `/payments/${paymentId}`,
      { paymentId, status, amount }
    );
  }

  static async createProductNotification(userId, title, message, productId = null) {
    return this.createNotification(
      userId,
      title,
      message,
      "product",
      productId ? `/products/${productId}` : null,
      { productId }
    );
  }

  static async createSystemNotification(userId, title, message) {
    return this.createNotification(userId, title, message, "system");
  }

  static async createPromotionNotification(userId, title, message, promotionId = null) {
    return this.createNotification(
      userId,
      title,
      message,
      "promotion",
      promotionId ? `/promotions/${promotionId}` : null,
      { promotionId }
    );
  }

  static async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: { userId, isRead: false },
      });
      return count;
    } catch (error) {
      console.error("Get unread count error:", error);
      return 0;
    }
  }

  static async markAllAsRead(userId) {
    try {
      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      );
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  }

  static async deleteOldNotifications(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      await Notification.destroy({
        where: {
          createdAt: {
            [require("sequelize").Op.lt]: cutoffDate,
          },
          isRead: true,
        },
      });
    } catch (error) {
      console.error("Delete old notifications error:", error);
    }
  }
}

module.exports = NotificationService;