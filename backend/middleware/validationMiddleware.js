const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  handleValidationErrors,
];

const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors,
];

const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .isIn(["skincare", "haircare", "makeup", "fragrance", "personal wellness", "beauty accessories"])
    .withMessage("Invalid category"),
  body("brand")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Brand is required and must be less than 50 characters"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  handleValidationErrors,
];

const validateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.productId")
    .isInt({ min: 1 })
    .withMessage("Valid product ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),
  body("paymentMethod")
    .isIn(["credit_card", "debit_card", "paypal", "stripe", "razorpay", "cash_on_delivery"])
    .withMessage("Invalid payment method"),
  body("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),
  handleValidationErrors,
];

const validatePasswordReset = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  handleValidationErrors,
];

const validateNewPassword = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  handleValidationErrors,
];

const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment must be less than 500 characters"),
  handleValidationErrors,
];

const validateAddress = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("phone")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("addressLine1")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Address line 1 must be between 5 and 100 characters"),
  body("city")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  body("postalCode")
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("Postal code must be between 3 and 10 characters"),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validatePasswordReset,
  validateNewPassword,
  validateReview,
  validateAddress,
};