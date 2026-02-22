const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('../middleware/errorHandler');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// Common validation rules
const validators = {
  // Auth validators
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validate,
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    validate,
  ],

  forgotPassword: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    validate,
  ],

  verifyOTP: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('otp')
      .notEmpty().withMessage('OTP is required')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
      .isNumeric().withMessage('OTP must be numeric'),
    validate,
  ],

  resetPassword: [
    body('token')
      .notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validate,
  ],

  // Product validators
  createProduct: [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required')
      .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('price')
      .notEmpty().withMessage('Price is required')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock')
      .notEmpty().withMessage('Stock is required')
      .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate,
  ],

  // Contact form validators
  contactForm: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required')
      .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
    validate,
  ],

  // ID parameter validator
  idParam: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid ID'),
    validate,
  ],

  // Pagination validators
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate,
  ],
};

module.exports = validators;
