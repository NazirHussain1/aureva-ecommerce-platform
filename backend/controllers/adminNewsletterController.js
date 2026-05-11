const Newsletter = require("../models/Newsletter");
const { sendBulkNewsletterEmail } = require("../services/emailService");

const sendNewsletter = async (req, res) => {
  const { subject, content } = req.body;

  try {
    const subscribers = await Newsletter.find({ isActive: true }).select("email");

    if (subscribers.length === 0) {
      return res.status(400).json({ message: "No active subscribers found" });
    }

    await sendBulkNewsletterEmail(subscribers, subject, content);

    res.status(200).json({
      message: "Newsletter sent successfully",
      sentTo: subscribers.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsletterStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [totalSubscribers, totalUnsubscribed, recentSubscribers] = await Promise.all([
      Newsletter.countDocuments({ isActive: true }),
      Newsletter.countDocuments({ isActive: false }),
      Newsletter.countDocuments({ isActive: true, createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    res.status(200).json({
      totalSubscribers,
      totalUnsubscribed,
      recentSubscribers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendNewsletter,
  getNewsletterStats,
};
