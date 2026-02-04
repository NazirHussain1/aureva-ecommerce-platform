const express = require("express");
const router = express.Router();
const {
  bulkUpdatePrices,
  bulkUpdateStock,
  bulkUpdateCategories,
  bulkDeleteProducts,
  bulkUpdateOrderStatus,
  exportProducts
} = require("../controllers/bulkOperationsController");
const { protect } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const { adminLimiter } = require("../middleware/rateLimitMiddleware");

// All routes require admin access
router.use(protect, adminMiddleware, adminLimiter);

// Product bulk operations
router.put("/products/prices", bulkUpdatePrices);
router.put("/products/stock", bulkUpdateStock);
router.put("/products/categories", bulkUpdateCategories);
router.delete("/products", bulkDeleteProducts);

// Order bulk operations
router.put("/orders/status", bulkUpdateOrderStatus);

// Export operations
router.get("/export/products", exportProducts);

module.exports = router;