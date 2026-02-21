const ContactMessage = require('../models/ContactMessage');
const { sendContactFormNotification, sendContactFormAutoReply } = require('../services/emailService');
const User = require('../models/User');
const Notification = require('../models/Notification');

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

    // Create notification for all admin users
    try {
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      
      const notificationPromises = adminUsers.map(admin => 
        Notification.create({
          userId: admin.id,
          title: 'New Contact Message',
          message: `${name} sent a message: ${subject}`,
          type: 'system',
          actionUrl: '/admin/contact-messages',
          metadata: {
            contactMessageId: contactMessage.id,
            senderEmail: email,
            senderName: name
          }
        })
      );

      await Promise.all(notificationPromises);
    } catch (notifError) {
      console.error('Failed to create admin notifications:', notifError);
    }

    // Send notification email to admin
    try {
      await sendContactFormNotification({
        name,
        email,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    // Send auto-reply to customer
    try {
      await sendContactFormAutoReply({
        name,
        email
      });
    } catch (autoReplyError) {
      console.error('Failed to send auto-reply email:', autoReplyError);
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
