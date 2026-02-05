const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');

const processPayment = async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order || order.UserId !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.create({
      orderId,
      userId: req.user.id,
      amount,
      paymentMethod,
      status: 'pending',
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    payment.status = 'completed';
    await payment.save();

    order.paymentStatus = 'paid';
    await order.save();

    res.status(200).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ message: "Payment processing failed" });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Order }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Order }, { model: User }],
    });

    if (!payment || payment.userId !== req.user.id) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  processPayment,
  getPaymentHistory,
  getPaymentDetails,
};