const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { placeOrder, getUserOrders, cancelOrder, returnOrder } = require("../controllers/orderController");
const { validateOrder } = require("../middleware/validationMiddleware");
const { orderLimiter } = require("../middleware/rateLimitMiddleware");

router.post("/", protect, orderLimiter, validateOrder, placeOrder);
router.get("/history", protect, getUserOrders);
router.put("/cancel/:id", protect, cancelOrder);
router.put("/return/:id", protect, returnOrder);

module.exports = router;
