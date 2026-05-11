const Order = require("../models/Order");
const { sendOrderStatusUpdateEmail } = require("../services/emailService");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const nextStatus = req.body.orderStatus || req.body.status;
    const allowedStatuses = ["placed", "pending", "processing", "shipped", "delivered", "cancelled", "returned"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = nextStatus === "placed" ? "pending" : nextStatus;

    if (nextStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    if (oldStatus !== order.orderStatus) {
      await sendOrderStatusUpdateEmail(order, order.user, order.orderStatus);
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};
