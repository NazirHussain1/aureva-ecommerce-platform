const Order = require("../models/Order");
const User = require("../models/User");
const { sendOrderStatusUpdateEmail } = require("../services/emailService");

const getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: ["User"],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: User }],
  });
  
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const oldStatus = order.orderStatus;
  order.orderStatus = req.body.status;
  
  if (req.body.status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  if (oldStatus !== req.body.status) {
    await sendOrderStatusUpdateEmail(order, order.User, req.body.status);
  }

  res.json({ message: "Order status updated", order });
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};
