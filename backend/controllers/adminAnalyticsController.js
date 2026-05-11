const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const getDateKey = (date, groupBy) => {
  if (groupBy === "hour") return `${date.getHours()}:00`;
  if (groupBy === "day") return date.toISOString().split("T")[0];
  return date.toISOString().slice(0, 7);
};

const getRangeStart = (range) => {
  const startDate = new Date();
  let groupBy = "day";

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      groupBy = "hour";
      break;
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      groupBy = "month";
      break;
    default:
      return { startDate: new Date(0), groupBy: "month" };
  }

  return { startDate, groupBy };
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, revenueResult, statusCounts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
    ]);

    const orderStatus = { placed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    statusCounts.forEach((item) => {
      orderStatus[item._id === "pending" ? "placed" : item._id] = item.count;
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      orderStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

const getMonthlySales = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await Order.find({
      paymentStatus: "completed",
      createdAt: { $gte: sixMonthsAgo },
    }).select("totalAmount createdAt");

    const monthlySales = {};
    orders.forEach((order) => {
      const month = order.createdAt.toISOString().slice(0, 7);
      monthlySales[month] = (monthlySales[month] || 0) + order.totalAmount;
    });

    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly sales" });
  }
};

const getSalesChartData = async (req, res) => {
  try {
    const { startDate, groupBy } = getRangeStart(req.query.range || "week");
    const orders = await Order.find({ createdAt: { $gte: startDate } })
      .select("totalAmount createdAt orderStatus")
      .sort({ createdAt: 1 });

    const chartData = {};
    orders.forEach((order) => {
      const key = getDateKey(new Date(order.createdAt), groupBy);
      if (!chartData[key]) chartData[key] = { date: key, revenue: 0, orders: 0 };
      chartData[key].revenue += Number(order.totalAmount);
      chartData[key].orders += 1;
    });

    res.json(Object.values(chartData).map((item) => ({
      ...item,
      revenue: Number(item.revenue.toFixed(2)),
    })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales data" });
  }
};

const getCategoryRevenue = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    const categoryData = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const category = item.product?.category || "Other";
        if (!categoryData[category]) categoryData[category] = { name: category, value: 0 };
        categoryData[category].value += Number(item.price) * item.quantity;
      });
    });

    res.json(Object.values(categoryData).map((item) => ({
      ...item,
      value: Number(item.value.toFixed(2)),
    })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching category data" });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const rows = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: parseInt(limit, 10) || 10 },
    ]);

    const products = await Product.find({ _id: { $in: rows.map((row) => row._id) } }).select("name");
    const productNames = new Map(products.map((product) => [product.id, product.name]));

    res.json(rows.map((row) => ({
      name: productNames.get(String(row._id)) || "Unknown",
      quantity: row.quantity,
      revenue: Number(row.revenue.toFixed(2)),
    })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching top products" });
  }
};

const getCustomerGrowth = async (req, res) => {
  try {
    const { startDate, groupBy } = getRangeStart(req.query.range || "year");
    const users = await User.find({ createdAt: { $gte: startDate } })
      .select("createdAt")
      .sort({ createdAt: 1 });
    const growthData = {};
    let cumulative = 0;

    users.forEach((user) => {
      const key = getDateKey(new Date(user.createdAt), groupBy === "hour" ? "day" : groupBy);
      if (!growthData[key]) growthData[key] = { date: key, newCustomers: 0, totalCustomers: 0 };
      growthData[key].newCustomers += 1;
    });

    res.json(Object.values(growthData).map((item) => {
      cumulative += item.newCustomers;
      return { ...item, totalCustomers: cumulative };
    }));
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer growth" });
  }
};

const getOrderStatusDistribution = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    res.json(statusCounts.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching order status" });
  }
};

const getDailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [todayOrders, yesterdayOrders] = await Promise.all([
      Order.find({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.find({ createdAt: { $gte: yesterday, $lt: today } }),
    ]);

    const totalSales = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = todayOrders.length;

    res.json({
      totalSales: Number(totalSales.toFixed(2)),
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0,
      growthPercentage: yesterdaySales > 0 ? Number((((totalSales - yesterdaySales) / yesterdaySales) * 100).toFixed(1)) : 0,
      comparisonDate: yesterday.toISOString().split("T")[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily sales" });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    const [monthlyOrders, lastMonthOrders] = await Promise.all([
      Order.find({ createdAt: { $gte: currentMonth, $lt: nextMonth } }),
      Order.find({ createdAt: { $gte: lastMonth, $lt: currentMonth } }),
    ]);

    const totalRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const dailyBreakdown = {};

    monthlyOrders.forEach((order) => {
      const day = new Date(order.createdAt).getDate();
      if (!dailyBreakdown[day]) dailyBreakdown[day] = { day, revenue: 0, orders: 0 };
      dailyBreakdown[day].revenue += Number(order.totalAmount);
      dailyBreakdown[day].orders += 1;
    });

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: monthlyOrders.length,
      averageOrderValue: monthlyOrders.length > 0 ? Number((totalRevenue / monthlyOrders.length).toFixed(2)) : 0,
      growthPercentage: lastMonthRevenue > 0 ? Number((((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)) : 0,
      monthName: currentMonth.toLocaleString("default", { month: "long", year: "numeric" }),
      dailyBreakdown: Object.values(dailyBreakdown)
        .sort((a, b) => a.day - b.day)
        .map((item) => ({ ...item, revenue: Number(item.revenue.toFixed(2)) })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly revenue" });
  }
};

const getRepeatCustomers = async (req, res) => {
  try {
    const [allCustomers, groupedOrders] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $group: { _id: "$user", orderCount: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } },
        { $match: { orderCount: { $gt: 1 } } },
        { $sort: { orderCount: -1 } },
      ]),
    ]);

    const orderFrequency = {};
    groupedOrders.forEach((customer) => {
      const count = customer.orderCount;
      const range = count >= 10 ? "10+" : count >= 5 ? "5-9" : count >= 3 ? "3-4" : "2";
      orderFrequency[range] = (orderFrequency[range] || 0) + 1;
    });

    const topRows = groupedOrders.slice(0, 10);
    const users = await User.find({ _id: { $in: topRows.map((row) => row._id) } }).select("name email");
    const userMap = new Map(users.map((user) => [user.id, user]));

    res.json({
      totalCustomers: allCustomers,
      repeatCustomers: groupedOrders.length,
      repeatCustomerPercentage: allCustomers > 0 ? Number(((groupedOrders.length / allCustomers) * 100).toFixed(1)) : 0,
      oneTimeCustomers: allCustomers - groupedOrders.length,
      orderFrequency: Object.entries(orderFrequency).map(([range, count]) => ({ range: `${range} orders`, count })),
      topCustomers: topRows.map((row) => {
        const user = userMap.get(String(row._id));
        return {
          name: user?.name || "Unknown",
          email: user?.email || "",
          orderCount: row.orderCount,
          totalSpent: Number(row.totalSpent.toFixed(2)),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching repeat customers data" });
  }
};

module.exports = {
  getDashboardStats,
  getMonthlySales,
  getSalesChartData,
  getCategoryRevenue,
  getTopProducts,
  getCustomerGrowth,
  getOrderStatusDistribution,
  getDailySales,
  getMonthlyRevenue,
  getRepeatCustomers,
};
