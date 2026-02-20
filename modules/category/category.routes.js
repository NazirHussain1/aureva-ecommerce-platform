const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const { protect, admin } = require('../../middleware/authMiddleware');
const {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  categorySlugValidation,
  getCategoryProductsValidation
} = require('./category.validation');

/**
 * Public Routes
 */

// Get category tree
router.get('/tree', categoryController.getCategoryTree);

// Get category by slug
router.get('/:slug', categorySlugValidation, categoryController.getCategoryBySlug);

// Get products by category
router.get(
  '/:slug/products',
  getCategoryProductsValidation,
  categoryController.getProductsByCategory
);

/**
 * Admin Routes
 */

// Create category
router.post(
  '/',
  protect,
  admin,
  createCategoryValidation,
  categoryController.createCategory
);

// Update category
router.put(
  '/:id',
  protect,
  admin,
  updateCategoryValidation,
  categoryController.updateCategory
);

// Delete category
router.delete(
  '/:id',
  protect,
  admin,
  categoryIdValidation,
  categoryController.deleteCategory
);

// Reassign products
router.post(
  '/:id/reassign',
  protect,
  admin,
  categoryIdValidation,
  categoryController.reassignProducts
);

module.exports = router;
