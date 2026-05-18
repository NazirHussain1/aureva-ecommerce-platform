/**
 * Notification Service - Database Agnostic Stub
 * TODO: Implement with MongoDB
 */

class NotificationService {
  static async createNotification(userId, title, message, type, actionUrl = null, metadata = null) {
    // TODO: Implement with MongoDB
    return null;
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
      completed: `Payment of ${amount} completed successfully`,
      failed: `Payment of ${amount} failed`,
      refunded: `Refund of ${amount} processed`,
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

  static async createLowStockAlert(productId, productName, stock, threshold = 5) {
    return this.createNotification(
      null,
      "Low stock alert",
      `${productName} has ${stock} item(s) left`,
      "product",
      `/admin/products`,
      { productId, productName, stock, threshold }
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
    // TODO: Implement with MongoDB
    return 0;
  }

  static async markAllAsRead(userId) {
    // TODO: Implement with MongoDB
  }

  static async deleteOldNotifications(days = 30) {
    // TODO: Implement with MongoDB
  }
}

module.exports = NotificationService;
