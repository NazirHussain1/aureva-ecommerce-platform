const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  processPayment,
  getPaymentHistory,
  getPaymentDetails,
} = require("../controllers/paymentController");

router.post("/process", protect, processPayment);
router.get("/history", protect, getPaymentHistory);
router.get("/:id", protect, getPaymentDetails);

module.exports = router;