const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminOrderController");

router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id", protect, isAdmin, updateOrderStatus);

module.exports = router;
 