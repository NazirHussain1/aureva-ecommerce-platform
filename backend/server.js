require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const { startNotificationCleanup } = require("./utils/notificationCleanup");

// Security middleware imports
const { 
  securityHeaders, 
  noSQLInjectionPrevention, 
  xssProtection, 
  corsOptions, 
  securityLogger 
} = require('./middleware/securityMiddleware');
const { generalLimiter } = require('./middleware/rateLimitMiddleware');

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
require("./models/Notification");
require("./models/ProductVariant");
require("./models/MerchantAccount");
require("./models/Payment");
require("./models/Shipment");
require("./models/ShipmentTracking");
require("./models/OrderItemReturn");
require("./models/OrderItemCancellation");
require("./models/ProductBundle");
require("./models/BundleItem");

const app = express();

// Apply security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(noSQLInjectionPrevention);
app.use(express.json({ limit: '10mb' }));
app.use(xssProtection);
app.use(securityLogger);

app.get("/", (req, res) => {
  res.send("AUREVA API Running...");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/password-reset", require("./routes/passwordResetRoutes"));
app.use("/api/email-verification", require("./routes/emailVerificationRoutes"));
app.use("/api/product-variants", require("./routes/productVariantRoutes"));
app.use("/api/bulk-operations", require("./routes/bulkOperationsRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/reports", require("./routes/reportingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/products", require("./routes/adminProductRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));
app.use("/api/admin/inventory", require("./routes/adminInventoryRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));
app.use("/api/admin/coupons", require("./routes/adminCouponRoutes"));
app.use("/api/admin/newsletter", require("./routes/adminNewsletterRoutes"));
app.use("/api/admin/payments", require("./routes/adminPaymentRoutes"));

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log("DB Error:", err));

sequelize.sync({ alter: true })
  .then(() => console.log("Tables synced"))
  .catch(err => console.log(err));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start notification cleanup service
  startNotificationCleanup();
});

// Setup Socket.IO for real-time analytics
const { Server } = require('socket.io');
const RealtimeAnalyticsService = require('./services/realtimeAnalyticsService');

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize real-time analytics
const realtimeAnalytics = new RealtimeAnalyticsService(io);

// Make io and realtimeAnalytics available globally
app.set('io', io);
app.set('realtimeAnalytics', realtimeAnalytics);

module.exports = { app, server, io, realtimeAnalytics };
