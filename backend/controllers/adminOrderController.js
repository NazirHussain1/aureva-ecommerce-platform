const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: ["User"],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = req.body.status;
  
  if (req.body.status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.json({ message: "Order status updated", order });
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};
