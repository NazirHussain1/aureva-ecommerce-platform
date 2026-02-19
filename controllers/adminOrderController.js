const Order = require("../models/Order");
const User = require("../models/User");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const { sendOrderStatusUpdateEmail } = require("../services/emailService");

const getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User },
      { model: OrderItem, include: [Product] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const nextStatus = req.body.orderStatus || req.body.status;
    const allowedStatuses = ["placed", "processing", "shipped", "delivered", "cancelled", "returned"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = nextStatus;
    
    if (nextStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    if (oldStatus !== nextStatus) {
      await sendOrderStatusUpdateEmail(order, order.User, nextStatus);
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};
