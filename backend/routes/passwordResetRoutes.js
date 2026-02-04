const express = require('express');
const router = express.Router();
const { 
  requestPasswordReset, 
  verifyResetToken, 
  resetPassword 
} = require('../controllers/passwordResetController');
const { 
  validatePasswordReset, 
  validateNewPassword 
} = require('../middleware/validationMiddleware');
const { passwordResetLimiter } = require('../middleware/rateLimitMiddleware');

// Request password reset
router.post('/request', passwordResetLimiter, validatePasswordReset, requestPasswordReset);

// Verify reset token
router.get('/verify/:token', verifyResetToken);

// Reset password
router.post('/reset', validateNewPassword, resetPassword);

module.exports = router;