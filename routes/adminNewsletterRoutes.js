const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  sendNewsletter,
  getNewsletterStats,
} = require("../controllers/adminNewsletterController");

router.post("/send", protect, admin, sendNewsletter);
router.get("/stats", protect, admin, getNewsletterStats);

module.exports = router;