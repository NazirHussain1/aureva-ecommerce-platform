const { sendEmail } = require("../config/email");
const {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  passwordResetTemplate,
  newsletterTemplate,
} = require("../utils/emailTemplates");

const sendWelcomeEmail = async (user) => {
  try {
    await sendEmail({
      email: user.email,
      subject: "Welcome to Aureva Beauty Shop! 💄",
      html: welcomeEmailTemplate(user.name),
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const sendOrderConfirmationEmail = async (order, user) => {
  try {
    await sendEmail({
      email: user.email,
      subject: `Order Confirmation - #${order.id}`,
      html: orderConfirmationTemplate(order, user),
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

const sendOrderStatusUpdateEmail = async (order, user, newStatus) => {
  try {
    const statusSubjects = {
      processing: `Order #${order.id} is being processed`,
      shipped: `Order #${order.id} has been shipped! 🚚`,
      delivered: `Order #${order.id} has been delivered! 📦`,
      cancelled: `Order #${order.id} has been cancelled`,
    };

    await sendEmail({
      email: user.email,
      subject: statusSubjects[newStatus],
      html: orderStatusUpdateTemplate(order, user, newStatus),
    });
  } catch (error) {
    console.error("Error sending order status update email:", error);
  }
};

const sendPasswordResetEmail = async (user, resetToken = null, otp = null) => {
  try {
    if (otp) {
      // Send OTP email
      await sendEmail({
        email: user.email,
        subject: "Password Reset OTP - Aureva Beauty Shop",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi ${user.name},</p>
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                We received a request to reset your password. Use the OTP below to proceed:
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Your OTP Code:</p>
                <h2 style="font-size: 36px; color: #a855f7; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h2>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
                ⏰ This OTP will expire in <strong>10 minutes</strong>.
              </p>
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
                If you didn't request this, please ignore this email or contact support if you have concerns.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Aureva Beauty Shop. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
    } else if (resetToken) {
      // Send reset link email (fallback)
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - Aureva Beauty Shop",
        html: passwordResetTemplate(user.name, resetToken),
      });
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

const sendNewsletterEmail = async (user, subject, content) => {
  try {
    await sendEmail({
      email: user.email,
      subject: subject,
      html: newsletterTemplate(user.name, subject, content),
    });
  } catch (error) {
    console.error("Error sending newsletter email:", error);
  }
};

const sendBulkNewsletterEmail = async (users, subject, content) => {
  try {
    const emailPromises = users.map(user => 
      sendNewsletterEmail(user, subject, content)
    );
    await Promise.all(emailPromises);
  } catch (error) {
    console.error("Error sending bulk newsletter emails:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail,
  sendNewsletterEmail,
  sendBulkNewsletterEmail,
};