const express = require('express');
const router = express.Router();
const {
  getAdvancedSalesReport,
  getCustomerSegmentationReport,
  getProductProfitabilityReport,
  getInventoryAnalysisReport,
  getCustomerLTVReport
} = require('../controllers/reportingController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { adminLimiter } = require('../middleware/rateLimitMiddleware');

// All reporting routes require admin access
router.use(protect, adminMiddleware, adminLimiter);

// Advanced reporting routes
router.get('/sales-advanced', getAdvancedSalesReport);
router.get('/customer-segmentation', getCustomerSegmentationReport);
router.get('/product-profitability', getProductProfitabilityReport);
router.get('/inventory-analysis', getInventoryAnalysisReport);
router.get('/customer-ltv', getCustomerLTVReport);

module.exports = router;