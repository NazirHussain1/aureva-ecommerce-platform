const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { placeOrder, getUserOrders, cancelOrder, returnOrder } = require("../controllers/orderController");

router.post("/", protect, placeOrder);
router.get("/history", protect, getUserOrders);
router.put("/cancel/:id", protect, cancelOrder);
router.put("/return/:id", protect, returnOrder);

module.exports = router;
