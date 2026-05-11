const Payment = require("../models/Payment");
const Order = require("../models/Order");

const processPayment = async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.create({
      order: orderId,
      user: req.user.id,
      amount,
      paymentMethod,
      paymentStatus: "completed",
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paidAt: new Date(),
    });

    order.paymentStatus = "completed";
    order.paidAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment processing failed" });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("order")
      .populate("user", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  processPayment,
  getPaymentHistory,
  getPaymentDetails,
};
