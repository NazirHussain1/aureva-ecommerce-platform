const NotificationService = require("../services/notificationService");

// Function to clean up old notifications (can be run as a cron job)
const cleanupOldNotifications = async () => {
  try {
    
    const deletedCount = await NotificationService.cleanupOldNotifications(30); // 30 days
    
  } catch (error) {
    
  }
};

// Run cleanup every 24 hours (86400000 ms)
const startNotificationCleanup = () => {
  // Run immediately on startup
  cleanupOldNotifications();
  
  // Then run every 24 hours
  setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);
};

module.exports = { cleanupOldNotifications, startNotificationCleanup };