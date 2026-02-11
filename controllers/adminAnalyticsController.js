const { Op } = require("sequelize");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Product = require("../models/Product");

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

const getSalesChartData = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    
    let startDate = new Date();
    let groupBy = 'day';
    
    switch(range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        groupBy = 'hour';
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = 'day';
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = 'day';
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(0);
        groupBy = 'month';
    }

    const orders = await Order.findAll({
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: ['totalAmount', 'createdAt', 'orderStatus'],
      order: [['createdAt', 'ASC']]
    });

    const chartData = {};
    
    orders.forEach(order => {
      let key;
      const date = new Date(order.createdAt);
      
      if (groupBy === 'hour') {
        key = `${date.getHours()}:00`;
      } else if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else {
        key = date.toISOString().slice(0, 7);
      }
      
      if (!chartData[key]) {
        chartData[key] = { date: key, revenue: 0, orders: 0 };
      }
      
      chartData[key].revenue += Number(order.totalAmount);
      chartData[key].orders += 1;
    });

    const result = Object.values(chartData).map(item => ({
      ...item,
      revenue: Number(item.revenue.toFixed(2))
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching sales chart data:', error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
};

const getCategoryRevenue = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        include: [{ model: Product }]
      }]
    });

    const categoryData = {};
    
    orders.forEach(order => {
      order.OrderItems?.forEach(item => {
        const category = item.Product?.category || 'Other';
        if (!categoryData[category]) {
          categoryData[category] = { name: category, value: 0 };
        }
        categoryData[category].value += Number(item.price) * item.quantity;
      });
    });

    const result = Object.values(categoryData).map(item => ({
      ...item,
      value: Number(item.value.toFixed(2))
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching category revenue:', error);
    res.status(500).json({ message: 'Error fetching category data' });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const orderItems = await OrderItem.findAll({
      include: [{ model: Product }],
      attributes: [
        'ProductId',
        [Order.sequelize.fn('SUM', Order.sequelize.col('quantity')), 'totalQuantity'],
        [Order.sequelize.fn('SUM', Order.sequelize.literal('price * quantity')), 'totalRevenue']
      ],
      group: ['ProductId', 'Product.id'],
      order: [[Order.sequelize.literal('totalQuantity'), 'DESC']],
      limit: parseInt(limit)
    });

    const result = orderItems.map(item => ({
      name: item.Product?.name || 'Unknown',
      quantity: parseInt(item.dataValues.totalQuantity),
      revenue: Number(parseFloat(item.dataValues.totalRevenue).toFixed(2))
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ message: 'Error fetching top products' });
  }
};

const getCustomerGrowth = async (req, res) => {
  try {
    const { range = 'year' } = req.query;
    
    let startDate = new Date();
    let groupBy = 'month';
    
    switch(range) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = 'day';
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = 'day';
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(0);
        groupBy = 'month';
    }

    const users = await User.findAll({
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: ['createdAt'],
      order: [['createdAt', 'ASC']]
    });

    const growthData = {};
    let cumulative = 0;
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      let key;
      
      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else {
        key = date.toISOString().slice(0, 7);
      }
      
      if (!growthData[key]) {
        growthData[key] = { date: key, newCustomers: 0, totalCustomers: 0 };
      }
      
      growthData[key].newCustomers += 1;
    });

    const result = Object.values(growthData).map(item => {
      cumulative += item.newCustomers;
      return {
        ...item,
        totalCustomers: cumulative
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching customer growth:', error);
    res.status(500).json({ message: 'Error fetching customer growth' });
  }
};

const getOrderStatusDistribution = async (req, res) => {
  try {
    const statusCounts = await Order.findAll({
      attributes: [
        'orderStatus',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count']
      ],
      group: ['orderStatus']
    });

    const result = statusCounts.map(item => ({
      name: item.orderStatus.charAt(0).toUpperCase() + item.orderStatus.slice(1),
      value: parseInt(item.dataValues.count)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching order status distribution:', error);
    res.status(500).json({ message: 'Error fetching order status' });
  }
};

const getDailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });

    const totalSales = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = todayOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    });

    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const growthPercentage = yesterdaySales > 0 
      ? ((totalSales - yesterdaySales) / yesterdaySales * 100).toFixed(1)
      : 0;

    res.json({
      totalSales: Number(totalSales.toFixed(2)),
      totalOrders,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      growthPercentage: Number(growthPercentage),
      comparisonDate: yesterday.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    res.status(500).json({ message: 'Error fetching daily sales' });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const monthlyOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: currentMonth,
          [Op.lt]: nextMonth
        }
      }
    });

    const totalRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = monthlyOrders.length;

    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const lastMonthOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: lastMonth,
          [Op.lt]: lastMonthEnd
        }
      }
    });

    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const growthPercentage = lastMonthRevenue > 0 
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;

    const dailyBreakdown = {};
    monthlyOrders.forEach(order => {
      const day = new Date(order.createdAt).getDate();
      if (!dailyBreakdown[day]) {
        dailyBreakdown[day] = { day, revenue: 0, orders: 0 };
      }
      dailyBreakdown[day].revenue += Number(order.totalAmount);
      dailyBreakdown[day].orders += 1;
    });

    const dailyData = Object.values(dailyBreakdown)
      .sort((a, b) => a.day - b.day)
      .map(item => ({
        ...item,
        revenue: Number(item.revenue.toFixed(2))
      }));

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0,
      growthPercentage: Number(growthPercentage),
      monthName: currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      dailyBreakdown: dailyData
    });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ message: 'Error fetching monthly revenue' });
  }
};

const getRepeatCustomers = async (req, res) => {
  try {
    const allCustomers = await User.count({
      where: { role: 'customer' }
    });

    const customersWithOrders = await Order.findAll({
      attributes: [
        'UserId',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'orderCount']
      ],
      group: ['UserId'],
      having: Order.sequelize.literal('COUNT(id) > 1')
    });

    const repeatCustomersCount = customersWithOrders.length;
    const repeatCustomerPercentage = allCustomers > 0 
      ? ((repeatCustomersCount / allCustomers) * 100).toFixed(1)
      : 0;

    const orderFrequency = {};
    customersWithOrders.forEach(customer => {
      const count = parseInt(customer.dataValues.orderCount);
      const range = count >= 10 ? '10+' : 
                    count >= 5 ? '5-9' : 
                    count >= 3 ? '3-4' : '2';
      orderFrequency[range] = (orderFrequency[range] || 0) + 1;
    });

    const frequencyData = Object.entries(orderFrequency).map(([range, count]) => ({
      range: `${range} orders`,
      count
    }));

    const topCustomers = await Order.findAll({
      attributes: [
        'UserId',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('Order.id')), 'orderCount'],
        [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalSpent']
      ],
      include: [{
        model: User,
        attributes: ['name', 'email']
      }],
      group: ['UserId', 'User.id'],
      order: [[Order.sequelize.literal('orderCount'), 'DESC']],
      limit: 10
    });

    const topCustomersData = topCustomers.map(customer => ({
      name: customer.User?.name || 'Unknown',
      email: customer.User?.email || '',
      orderCount: parseInt(customer.dataValues.orderCount),
      totalSpent: Number(parseFloat(customer.dataValues.totalSpent).toFixed(2))
    }));

    res.json({
      totalCustomers: allCustomers,
      repeatCustomers: repeatCustomersCount,
      repeatCustomerPercentage: Number(repeatCustomerPercentage),
      oneTimeCustomers: allCustomers - repeatCustomersCount,
      orderFrequency: frequencyData,
      topCustomers: topCustomersData
    });
  } catch (error) {
    console.error('Error fetching repeat customers:', error);
    res.status(500).json({ message: 'Error fetching repeat customers data' });
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
  getRepeatCustomers
};
