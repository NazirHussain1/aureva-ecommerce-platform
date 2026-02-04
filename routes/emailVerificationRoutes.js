const express = require('express');
const router = express.Router();
const { 
  verifyEmail, 
  resendVerificationEmail 
} = require('../controllers/emailVerificationController');
const { validatePasswordReset } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Verify email with token
router.get('/verify/:token', verifyEmail);

// Resend verification email
router.post('/resend', authLimiter, validatePasswordReset, resendVerificationEmail);

module.exports = router;