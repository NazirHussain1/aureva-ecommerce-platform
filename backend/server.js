require("dotenv").config();
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const sequelize = require("./config/db");
const logger = require("./utils/logger");
const securityConfig = require("./config/security");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Load models
require("./models/User");
require("./models/Product");
require("./models/Order");
require("./models/OrderItem");
require("./models/Cart");
require("./models/Wishlist");
require("./models/Address");
require("./models/Review");
require("./models/Coupon");
require("./models/Newsletter");
require("./models/Payment");
require("./models/Notification");
require("./models/Settings");
require("./models/ContactMessage");

// Load Category model and relationships
require("./models/index");

const app = express();

// Trust proxy (for Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Security middleware
securityConfig(app);

// Compression middleware
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Health check routes (no rate limiting)
app.use('/', require('./routes/healthRoutes'));

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

// Enterprise Category Routes
app.use("/api/categories", require("./modules/category/category.routes"));

// Admin Routes
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/products", require("./routes/adminProductRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));
app.use("/api/admin/inventory", require("./routes/adminInventoryRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));
app.use("/api/admin/coupons", require("./routes/adminCouponRoutes"));
app.use("/api/admin/newsletter", require("./routes/adminNewsletterRoutes"));
app.use("/api/admin/settings", require("./routes/adminSettingsRoutes"));

// Public Routes
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  try {
    await sequelize.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Start server
sequelize
  .sync()
  .then(() => {
    logger.info("✅ Database synced successfully");
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    logger.error("❌ Database sync failed:", err);
    process.exit(1);
  });

module.exports = app;
