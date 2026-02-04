const express = require("express");
const router = express.Router();
const { signup, login, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require("../middleware/validationMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

// Auth routes with validation and rate limiting
router.post("/register", authLimiter, validateUserRegistration, signup);
router.post("/login", authLimiter, validateUserLogin, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
