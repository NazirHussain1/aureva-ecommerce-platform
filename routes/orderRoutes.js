const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  returnOrder,
} = require("../controllers/orderController");
const { validateOrder } = require("../middleware/validationMiddleware");
const { orderLimiter } = require("../middleware/rateLimitMiddleware");

router.post("/", protect, orderLimiter, validateOrder, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/history", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/return", protect, returnOrder);
router.put("/cancel/:id", protect, cancelOrder);
router.put("/return/:id", protect, returnOrder);
router.get("/:id", protect, getOrderById);

module.exports = router;
