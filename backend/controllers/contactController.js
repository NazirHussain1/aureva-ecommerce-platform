const ContactMessage = require("../models/ContactMessage");
const { sendContactFormNotification, sendContactFormAutoReply } = require("../services/emailService");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    try {
      const adminUsers = await User.find({ role: "admin" });

      await Promise.all(adminUsers.map((admin) =>
        Notification.create({
          user: admin.id,
          title: "New Contact Message",
          message: `${name} sent a message: ${subject}`,
          type: "system",
          actionUrl: "/admin/contact-messages",
          metadata: {
            contactMessageId: contactMessage.id,
            senderEmail: email,
            senderName: name,
          },
        })
      ));
    } catch (notifError) {
      // Contact submission should succeed even if admin notification creation fails.
    }

    try {
      await sendContactFormNotification({ name, email, subject, message });
    } catch (emailError) {
      // Email delivery is best-effort for contact form submissions.
    }

    try {
      await sendContactFormAutoReply({ name, email });
    } catch (autoReplyError) {
      // Auto-reply delivery is best-effort.
    }

    res.status(201).json({
      message: "Message sent successfully. We will get back to you shortly.",
      contactMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit message" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const skip = (currentPage - 1) * parsedLimit;
    const filter = {};

    if (isRead !== undefined) {
      filter.status = isRead === "true" ? "read" : "new";
    }

    const [rows, count] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
      ContactMessage.countDocuments(filter),
    ]);

    res.json({
      messages: rows,
      totalMessages: count,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch message" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message marked as read", contactMessage: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to update message" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
};
