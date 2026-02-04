const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createSystemNotification,
  sendBulkNotification
} = require("../controllers/notificationController");

// User notification routes
router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/:id/read", protect, markAsRead);
router.put("/mark-all-read", protect, markAllAsRead);

// Admin notification routes
router.post("/system", protect, adminMiddleware, createSystemNotification);
router.post("/bulk", protect, adminMiddleware, sendBulkNotification);

module.exports = router;