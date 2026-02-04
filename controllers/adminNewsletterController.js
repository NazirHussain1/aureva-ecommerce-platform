const Newsletter = require("../models/Newsletter");
const { sendBulkNewsletterEmail } = require("../services/emailService");

const sendNewsletter = async (req, res) => {
  const { subject, content } = req.body;

  try {
    const subscribers = await Newsletter.findAll({
      where: { isSubscribed: true },
      attributes: ["email", "name"],
    });

    if (subscribers.length === 0) {
      return res.status(400).json({ message: "No active subscribers found" });
    }

    await sendBulkNewsletterEmail(subscribers, subject, content);

    res.status(200).json({
      message: "Newsletter sent successfully",
      sentTo: subscribers.length,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsletterStats = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.count({ where: { isSubscribed: true } });
    const totalUnsubscribed = await Newsletter.count({ where: { isSubscribed: false } });
    const recentSubscribers = await Newsletter.count({
      where: {
        isSubscribed: true,
        subscribedAt: {
          [require("sequelize").Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.status(200).json({
      totalSubscribers,
      totalUnsubscribed,
      recentSubscribers,
    });
  } catch (error) {
    console.error("Get newsletter stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendNewsletter,
  getNewsletterStats,
};