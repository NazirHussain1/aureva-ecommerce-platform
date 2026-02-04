const PasswordResetService = require('../services/passwordResetService');

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await PasswordResetService.requestPasswordReset(email);
    
    res.json(result);
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process password reset request' 
    });
  }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const isValid = await PasswordResetService.verifyResetToken(token);
    
    if (isValid) {
      res.json({ 
        success: true, 
        message: 'Reset token is valid' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify reset token' 
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const result = await PasswordResetService.resetPassword(token, password);
    
    res.json(result);
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset password' 
    });
  }
};

module.exports = {
  requestPasswordReset,
  verifyResetToken,
  resetPassword
};