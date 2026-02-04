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

const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - Aureva Beauty Shop",
      html: passwordResetTemplate(user.name, resetToken),
    });
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