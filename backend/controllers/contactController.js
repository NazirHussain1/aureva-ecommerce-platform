const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../services/emailService');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    // Send notification email to admin (optional)
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@aureva.com',
        subject: `New Contact Message: ${subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    res.status(201).json({ 
      message: 'Message sent successfully. We will get back to you shortly.',
      contactMessage 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to submit message' });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const { count, rows } = await ContactMessage.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      messages: rows,
      totalMessages: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: 'Failed to fetch message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.update({ isRead: true });
    res.json({ message: 'Message marked as read', contactMessage: message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Failed to update message' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
