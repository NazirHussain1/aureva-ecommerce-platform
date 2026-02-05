const nodemailer = require("nodemailer");

let transporter = null;

try {
  transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} catch (error) {
  console.warn("Email configuration not set up. Email features will be disabled.");
}

const sendEmail = async (options) => {
  if (!transporter) {
    console.warn("Email not configured. Skipping email send.");
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendEmail };