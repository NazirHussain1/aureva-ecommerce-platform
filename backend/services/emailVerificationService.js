const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../config/email');

class EmailVerificationService {
  // Generate email verification token
  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email
  static async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Verify Your Email Address 📧</h1>
              </div>
              <div class="content">
                  <h2>Hello ${user.name}!</h2>
                  <p>Thank you for registering with Aureva Beauty Shop! To complete your registration, please verify your email address.</p>
                  
                  <p>Click the button below to verify your email:</p>
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                  
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                  
                  <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
                  
                  <p>If you didn't create an account with us, please ignore this email.</p>
              </div>
              <div class="footer">
                  <p>Welcome to Aureva Beauty Shop!</p>
                  <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email Address - Aureva Beauty Shop',
      html: emailTemplate
    });
  }

  // Send verification email to user
  static async sendVerificationToUser(userId) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.emailVerified) {
        return { 
          success: false, 
          message: 'Email is already verified' 
        };
      }

      // Generate new verification token
      const verificationToken = this.generateVerificationToken();
      
      // Update user with verification token
      await user.update({
        emailVerificationToken: verificationToken
      });

      // Send verification email
      await this.sendVerificationEmail(user, verificationToken);

      return { 
        success: true, 
        message: 'Verification email sent successfully' 
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Verify email with token
  static async verifyEmail(token) {
    try {
      const user = await User.findOne({
        where: {
          emailVerificationToken: token
        }
      });

      if (!user) {
        throw new Error('Invalid verification token');
      }

      if (user.emailVerified) {
        return { 
          success: false, 
          message: 'Email is already verified' 
        };
      }

      // Mark email as verified and clear token
      await user.update({
        emailVerified: true,
        emailVerificationToken: null
      });

      // Send welcome email after verification
      const { sendWelcomeEmail } = require('./emailService');
      await sendWelcomeEmail(user);

      return { 
        success: true, 
        message: 'Email verified successfully' 
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      if (error.message === 'Invalid verification token') {
        throw error;
      }
      throw new Error('Failed to verify email');
    }
  }

  // Resend verification email
  static async resendVerificationEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Don't reveal if user exists or not for security
        return { 
          success: true, 
          message: 'If an account with that email exists, a verification email has been sent.' 
        };
      }

      if (user.emailVerified) {
        return { 
          success: false, 
          message: 'Email is already verified' 
        };
      }

      // Generate new verification token
      const verificationToken = this.generateVerificationToken();
      
      // Update user with new verification token
      await user.update({
        emailVerificationToken: verificationToken
      });

      // Send verification email
      await this.sendVerificationEmail(user, verificationToken);

      return { 
        success: true, 
        message: 'Verification email sent successfully' 
      };
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw new Error('Failed to resend verification email');
    }
  }
}

module.exports = EmailVerificationService;