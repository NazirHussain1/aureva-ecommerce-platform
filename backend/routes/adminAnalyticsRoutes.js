const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getMonthlySales,
  getSalesChartData,
  getCategoryRevenue,
  getTopProducts,
  getCustomerGrowth,
  getOrderStatusDistribution,
  getDailySales,
  getMonthlyRevenue,
  getRepeatCustomers
} = require("../controllers/adminAnalyticsController");

router.get("/stats", protect, isAdmin, getDashboardStats);
router.get("/monthly-sales", protect, isAdmin, getMonthlySales);
router.get("/sales-chart", protect, isAdmin, getSalesChartData);
router.get("/category-revenue", protect, isAdmin, getCategoryRevenue);
router.get("/top-products", protect, isAdmin, getTopProducts);
router.get("/customer-growth", protect, isAdmin, getCustomerGrowth);
router.get("/order-status", protect, isAdmin, getOrderStatusDistribution);
router.get("/daily-sales", protect, isAdmin, getDailySales);
router.get("/monthly-revenue", protect, isAdmin, getMonthlyRevenue);
router.get("/repeat-customers", protect, isAdmin, getRepeatCustomers);

module.exports = router;
