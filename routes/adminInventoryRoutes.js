const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  getLowStockProducts,
} = require("../controllers/adminInventoryController");

router.get("/low-stock", protect, isAdmin, getLowStockProducts);

module.exports = router;