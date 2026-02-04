const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('./emailService');

class PasswordResetService {
  // Generate password reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash reset token for storage
  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Request password reset
  static async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Don't reveal if user exists or not for security
        return { success: true, message: 'If an account with that email exists, a reset link has been sent.' };
      }

      // Generate reset token
      const resetToken = this.generateResetToken();
      const hashedToken = this.hashToken(resetToken);

      // Set token and expiry (15 minutes from now)
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

      // Update user with reset token
      await user.update({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: resetTokenExpiry
      });

      // Send reset email
      await sendPasswordResetEmail(user, resetToken);

      return { 
        success: true, 
        message: 'Password reset email sent successfully.' 
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw new Error('Failed to process password reset request');
    }
  }

  // Reset password with token
  static async resetPassword(token, newPassword) {
    try {
      const hashedToken = this.hashToken(token);

      // Find user with valid reset token
      const user = await User.findOne({
        where: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password and clear reset token
      await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      // Send confirmation email
      const { sendEmail } = require('../config/email');
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Successful - Aureva Beauty Shop',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Successful</h2>
            <p>Hello ${user.name},</p>
            <p>Your password has been successfully reset for your Aureva Beauty Shop account.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <p>Best regards,<br>Aureva Beauty Shop Team</p>
          </div>
        `
      });

      return { 
        success: true, 
        message: 'Password reset successfully.' 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.message === 'Invalid or expired reset token') {
        throw error;
      }
      throw new Error('Failed to reset password');
    }
  }

  // Verify reset token (without resetting password)
  static async verifyResetToken(token) {
    try {
      const hashedToken = this.hashToken(token);

      const user = await User.findOne({
        where: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      return !!user;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      return false;
    }
  }
}

module.exports = PasswordResetService;