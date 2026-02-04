const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { applyCoupon } = require("../controllers/couponController");

router.post("/apply", protect, applyCoupon);

module.exports = router;
