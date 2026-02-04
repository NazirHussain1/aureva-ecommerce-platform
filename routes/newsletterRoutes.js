const express = require("express");
const router = express.Router();
const {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscribers,
} = require("../controllers/newsletterController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/subscribe", subscribeToNewsletter);
router.post("/unsubscribe", unsubscribeFromNewsletter);
router.get("/subscribers", protect, admin, getNewsletterSubscribers);

module.exports = router;