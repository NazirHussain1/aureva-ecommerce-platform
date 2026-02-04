const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getMonthlySales,
} = require("../controllers/adminAnalyticsController");

router.get("/stats", protect, isAdmin, getDashboardStats);
router.get("/monthly-sales", protect, isAdmin, getMonthlySales);

module.exports = router;
