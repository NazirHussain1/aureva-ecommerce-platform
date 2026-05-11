const Newsletter = require("../models/Newsletter");

const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ message: "Email already subscribed to newsletter" });
      }

      existingSubscription.isActive = true;
      existingSubscription.unsubscribedAt = undefined;
      await existingSubscription.save();
      return res.status(200).json({ message: "Successfully resubscribed to newsletter" });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: "Successfully subscribed to newsletter" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const unsubscribeFromNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const subscription = await Newsletter.findOneAndUpdate(
      { email },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Email not found in newsletter" });
    }

    res.status(200).json({ message: "Successfully unsubscribed from newsletter" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true })
      .select("email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscribers,
};
