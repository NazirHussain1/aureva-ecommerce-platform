const { Op } = require("sequelize");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  const totalUsers = await User.count();
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum("totalAmount", {
    where: { paymentStatus: "paid" },
  });

  const orderStatus = {
    placed: await Order.count({ where: { orderStatus: "placed" } }),
    processing: await Order.count({ where: { orderStatus: "processing" } }),
    shipped: await Order.count({ where: { orderStatus: "shipped" } }),
    delivered: await Order.count({ where: { orderStatus: "delivered" } }),
    cancelled: await Order.count({ where: { orderStatus: "cancelled" } }),
  };

  res.json({
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue || 0,
    orderStatus,
  });
};

const getMonthlySales = async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const orders = await Order.findAll({
    where: {
      paymentStatus: "paid",
      createdAt: { [Op.gte]: sixMonthsAgo },
    },
    attributes: ["totalAmount", "createdAt"],
  });

  const monthlySales = {};

  orders.forEach((order) => {
    const month = order.createdAt.toISOString().slice(0, 7);
    monthlySales[month] =
      (monthlySales[month] || 0) + order.totalAmount;
  });

  res.json(monthlySales);
};

module.exports = {
  getDashboardStats,
  getMonthlySales,
};
