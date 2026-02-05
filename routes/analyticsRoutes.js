const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getSalesReport,
  getProductPerformance,
  getCustomerAnalytics,
  getCategoryPerformance,
  getRevenueTracking,
  getComprehensiveReport,
  exportAnalyticsData
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { adminLimiter } = require('../middleware/rateLimitMiddleware');

// All analytics routes require admin access
router.use(protect, adminMiddleware, adminLimiter);

// Dashboard and summary routes
router.get('/dashboard', getDashboardSummary);
router.get('/comprehensive', getComprehensiveReport);

// Specific analytics routes
router.get('/sales', getSalesReport);
router.get('/products', getProductPerformance);
router.get('/customers', getCustomerAnalytics);
router.get('/categories', getCategoryPerformance);
router.get('/revenue', getRevenueTracking);

// Export routes
router.get('/export', exportAnalyticsData);

module.exports = router;