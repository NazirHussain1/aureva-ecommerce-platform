require("./config/loadEnv");

const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const logger = require("./utils/logger");
const securityConfig = require("./config/security");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

app.set("trust proxy", 1);

securityConfig(app);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: logger.stream }));
}

app.use("/api/", apiLimiter);
app.use("/", require("./routes/healthRoutes"));

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

app.use("/api/categories", require("./modules/category/category.routes"));

app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/products", require("./routes/adminProductRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));
app.use("/api/admin/inventory", require("./routes/adminInventoryRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));
app.use("/api/admin/coupons", require("./routes/adminCouponRoutes"));
app.use("/api/admin/newsletter", require("./routes/adminNewsletterRoutes"));
app.use("/api/admin/settings", require("./routes/adminSettingsRoutes"));

app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
