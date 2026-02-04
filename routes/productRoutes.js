const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  searchProducts,
  getProductSuggestions
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateProduct } = require("../middleware/validationMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/suggestions", getProductSuggestions);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/:id", getProductById);

// Admin routes
router.post("/", protect, admin, validateProduct, createProduct);
router.put("/:id", protect, admin, validateProduct, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
