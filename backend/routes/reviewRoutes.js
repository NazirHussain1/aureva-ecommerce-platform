const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProductReviews,
  getProductReviewsBySlug,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/slug/:slug", getProductReviewsBySlug);
router.get("/:productId", getProductReviews);
router.post("/:productId", protect, createReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
