const { body, param, query } = require('express-validator');

/**
 * Validation rules for category operations
 */

const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Icon identifier too long'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid image URL'),
  
  body('parentId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid parent category ID'),
  
  body('level')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Level must be 0, 1, or 2'),
  
  body('metaTitle')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Meta title cannot exceed 200 characters'),
  
  body('metaDescription')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Meta description cannot exceed 500 characters'),
  
  body('metaKeywords')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Meta keywords cannot exceed 300 characters'),
  
  body('displayOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Display order must be a positive integer'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean')
];

const updateCategoryValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid category ID'),
  
  ...createCategoryValidation
];

const categoryIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid category ID')
];

const categorySlugValidation = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format')
];

const getCategoryProductsValidation = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Category slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format'),
  
  query('gender')
    .optional()
    .isIn(['MEN', 'WOMEN', 'UNISEX']).withMessage('Invalid gender value'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Invalid minimum price'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Invalid maximum price'),
  
  query('brand')
    .optional()
    .trim(),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['price', 'name', 'createdAt', 'popularity']).withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  categorySlugValidation,
  getCategoryProductsValidation
};
