const nodemailer = require("nodemailer");

let transporter = null;
let isEmailConfigured = false;

// Initialize email transporter
const initializeEmailTransporter = () => {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️  Email configuration not set up. Email features will be disabled.");
      return;
    }

    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // For development
      }
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email transporter verification failed:", error.message);
        isEmailConfigured = false;
      } else {
        console.log("✅ Email server is ready to send messages");
        isEmailConfigured = true;
      }
    });

  } catch (error) {
    console.error("❌ Error initializing email transporter:", error.message);
    console.error("Stack:", error.stack);
    isEmailConfigured = false;
  }
};

// Initialize on module load
try {
  initializeEmailTransporter();
} catch (err) {
  console.error("❌ Failed to initialize email:", err);
}

const sendEmail = async (options) => {
  if (!transporter || !isEmailConfigured) {
    console.warn("⚠️  Email not configured. Skipping email send.");
    return { success: false, message: "Email not configured" };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Aureva Beauty" <${process.env.EMAIL_USER}>`,
      to: options.to || options.email,
      subject: options.subject,
      html: options.html,
      text: options.text || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, isEmailConfigured };