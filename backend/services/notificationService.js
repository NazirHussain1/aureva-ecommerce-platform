const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendEmail } = require("../config/email");

class NotificationService {
  // Create a new notification
  static async createNotification(userId, type, title, message, metadata = {}) {
    try {
      const notification = await Notification.create({
        UserId: userId,
        type,
        title,
        message,
        metadata,
      });
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Create order status notification
  static async createOrderStatusNotification(userId, orderId, status) {
    const statusMessages = {
      processing: "Your order is being processed",
      shipped: "Your order has been shipped! 🚚",
      delivered: "Your order has been delivered! 📦",
      cancelled: "Your order has been cancelled",
      returned: "Your return request has been processed"
    };

    const title = `Order #${orderId} Update`;
    const message = statusMessages[status] || "Your order status has been updated";

    return await this.createNotification(userId, "order_status", title, message, {
      orderId,
      status
    });
  }

  // Create low stock alert for admin
  static async createLowStockAlert(productId, productName, currentStock, threshold = 5) {
    try {
      // Get all admin users
      const adminUsers = await User.findAll({ where: { role: "admin" } });
      
      const title = "Low Stock Alert";
      const message = `Product "${productName}" is running low on stock. Current stock: ${currentStock}`;

      const notifications = [];
      for (const admin of adminUsers) {
        const notification = await this.createNotification(
          admin.id,
          "low_stock",
          title,
          message,
          { productId, productName, currentStock, threshold }
        );
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error("Error creating low stock alert:", error);
      throw error;
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, limit = 20, offset = 0) {
    try {
      const notifications = await Notification.findAndCountAll({
        where: { UserId: userId },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, UserId: userId }
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      notification.isRead = true;
      await notification.save();
      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read for user
  static async markAllAsRead(userId) {
    try {
      await Notification.update(
        { isRead: true },
        { where: { UserId: userId, isRead: false } }
      );
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: { UserId: userId, isRead: false }
      });
      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }

  // Delete old notifications (cleanup)
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deletedCount = await Notification.destroy({
        where: {
          createdAt: { [require("sequelize").Op.lt]: cutoffDate },
          isRead: true
        }
      });

      console.log(`Cleaned up ${deletedCount} old notifications`);
      return deletedCount;
    } catch (error) {
      console.error("Error cleaning up notifications:", error);
      throw error;
    }
  }

  // Send email notification (for important notifications)
  static async sendEmailNotification(userId, subject, message) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      await sendEmail({
        email: user.email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${subject}</h2>
            <p>${message}</p>
            <p>Best regards,<br>Aureva Beauty Shop Team</p>
          </div>
        `
      });

      return true;
    } catch (error) {
      console.error("Error sending email notification:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;