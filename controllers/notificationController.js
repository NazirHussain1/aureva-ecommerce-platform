const NotificationService = require("../services/notificationService");

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await NotificationService.getUserNotifications(
      req.user.id,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      notifications: result.rows,
      totalCount: result.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      hasMore: result.count > offset + result.rows.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unread notifications count
const getUnreadCount = async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.markAsRead(id, req.user.id);
    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error(error);
    if (error.message === "Notification not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create system notification (admin only)
const createSystemNotification = async (req, res) => {
  try {
    const { userId, title, message, type = "system" } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const notification = await NotificationService.createNotification(
      userId,
      type,
      title,
      message
    );

    res.status(201).json({
      message: "Notification created successfully",
      notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send bulk notifications to all users (admin only)
const sendBulkNotification = async (req, res) => {
  try {
    const { title, message, type = "system" } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get all users
    const User = require("../models/User");
    const users = await User.findAll({ attributes: ["id"] });

    const notifications = [];
    for (const user of users) {
      const notification = await NotificationService.createNotification(
        user.id,
        type,
        title,
        message
      );
      notifications.push(notification);
    }

    res.json({
      message: `Bulk notification sent to ${users.length} users`,
      count: notifications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createSystemNotification,
  sendBulkNotification
};