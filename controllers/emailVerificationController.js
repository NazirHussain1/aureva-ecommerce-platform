const EmailVerificationService = require('../services/emailVerificationService');

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const result = await EmailVerificationService.verifyEmail(token);
    
    res.json(result);
  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error.message === 'Invalid verification token') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify email' 
    });
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await EmailVerificationService.resendVerificationEmail(email);
    
    res.json(result);
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to resend verification email' 
    });
  }
};

module.exports = {
  verifyEmail,
  resendVerificationEmail
};