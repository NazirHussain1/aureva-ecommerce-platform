const { Op } = require("sequelize");
const Order = require("../models/Order");
const User = require("../models/User");

/* Dashboard Stats */
const getDashboardStats = async (req, res) => {
  // total users
  const totalUsers = await User.count();

  // total orders
  const totalOrders = await Order.count();

  // total revenue (only paid orders)
  const totalRevenue = await Order.sum("totalAmount", {
    where: { paymentStatus: "paid" },
  });

  // order status breakdown
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

/* Monthly Sales (Last 6 Months) */
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
    const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
    monthlySales[month] =
      (monthlySales[month] || 0) + order.totalAmount;
  });

  res.json(monthlySales);
};

module.exports = {
  getDashboardStats,
  getMonthlySales,
};
