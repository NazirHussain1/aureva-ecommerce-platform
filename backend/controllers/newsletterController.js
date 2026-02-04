const Newsletter = require("../models/Newsletter");
const { sendNewsletterEmail } = require("../services/emailService");

const subscribeToNewsletter = async (req, res) => {
  const { email, name } = req.body;

  try {
    const existingSubscription = await Newsletter.findOne({ where: { email } });

    if (existingSubscription) {
      if (existingSubscription.isSubscribed) {
        return res.status(400).json({ message: "Email already subscribed to newsletter" });
      } else {
        existingSubscription.isSubscribed = true;
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();
        return res.status(200).json({ message: "Successfully resubscribed to newsletter" });
      }
    }

    await Newsletter.create({ email, name });
    res.status(201).json({ message: "Successfully subscribed to newsletter" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const unsubscribeFromNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const subscription = await Newsletter.findOne({ where: { email } });

    if (!subscription) {
      return res.status(404).json({ message: "Email not found in newsletter" });
    }

    subscription.isSubscribed = false;
    await subscription.save();

    res.status(200).json({ message: "Successfully unsubscribed from newsletter" });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.findAll({
      where: { isSubscribed: true },
      attributes: ["email", "name", "subscribedAt"],
      order: [["subscribedAt", "DESC"]],
    });

    res.status(200).json({
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error("Get newsletter subscribers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscribers,
};