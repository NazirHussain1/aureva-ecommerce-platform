const express = require("express");
const router = express.Router();
const {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getVariantById,
  bulkCreateVariants
} = require("../controllers/productVariantController");
const { protect } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// Public routes
router.get("/product/:productId", getProductVariants);
router.get("/:variantId", getVariantById);

// Admin routes
router.post("/product/:productId", protect, adminMiddleware, createProductVariant);
router.post("/product/:productId/bulk", protect, adminMiddleware, bulkCreateVariants);
router.put("/:variantId", protect, adminMiddleware, updateProductVariant);
router.delete("/:variantId", protect, adminMiddleware, deleteProductVariant);

module.exports = router;