const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');

class TokenManager {
  // Generate access token
  static generateAccessToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
  }

  // Generate both tokens
  static generateTokenPair(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  // Verify access token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Access token expired', 401);
      }
      throw new AppError('Invalid access token', 401);
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token expired', 401);
      }
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // Generate secure OTP
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Hash OTP for secure storage
  static hashOTP(otp) {
    return crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
  }

  // Verify OTP
  static verifyOTP(inputOTP, hashedOTP) {
    const hashedInput = this.hashOTP(inputOTP);
    return hashedInput === hashedOTP;
  }

  // Generate password reset token
  static generateResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    return { resetToken, hashedToken };
  }
}

module.exports = TokenManager;
