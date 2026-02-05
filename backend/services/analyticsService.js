const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

class AnalyticsService {
  // Sales Analytics
  static async getSalesReport(startDate, endDate, groupBy = 'day') {
    try {
      let dateFormat;
      switch (groupBy) {
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00:00';
          break;
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-%u';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        case 'year':
          dateFormat = '%Y';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }

      const salesData = await Order.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'period'],
          [fn('COUNT', col('id')), 'totalOrders'],
          [fn('SUM', col('totalAmount')), 'totalRevenue'],
          [fn('AVG', col('totalAmount')), 'averageOrderValue']
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          },
          orderStatus: {
            [Op.notIn]: ['cancelled']
          }
        },
        group: [fn('DATE_FORMAT', col('createdAt'), dateFormat)],
        order: [[fn('DATE_FORMAT', col('createdAt'), dateFormat), 'ASC']],
        raw: true
      });

      // Calculate totals
      const totals = await Order.findOne({
        attributes: [
          [fn('COUNT', col('id')), 'totalOrders'],
          [fn('SUM', col('totalAmount')), 'totalRevenue'],
          [fn('AVG', col('totalAmount')), 'averageOrderValue']
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          },
          orderStatus: {
            [Op.notIn]: ['cancelled']
          }
        },
        raw: true
      });

      return {
        salesData: salesData.map(item => ({
          period: item.period,
          totalOrders: parseInt(item.totalOrders),
          totalRevenue: parseFloat(item.totalRevenue || 0),
          averageOrderValue: parseFloat(item.averageOrderValue || 0)
        })),
        summary: {
          totalOrders: parseInt(totals.totalOrders || 0),
          totalRevenue: parseFloat(totals.totalRevenue || 0),
          averageOrderValue: parseFloat(totals.averageOrderValue || 0)
        }
      };
    } catch (error) {
      console.error('Error generating sales report:', error);
      throw error;
    }
  }

  // Product Performance Analytics
  static async getProductPerformance(startDate, endDate, limit = 10) {
    try {
      const topProducts = await OrderItem.findAll({
        attributes: [
          'ProductId',
          [fn('SUM', col('quantity')), 'totalSold'],
          [fn('SUM', literal('quantity * price')), 'totalRevenue'],
          [fn('COUNT', fn('DISTINCT', col('OrderId'))), 'orderCount']
        ],
        include: [
          {
            model: Product,
            attributes: ['name', 'category', 'brand', 'price', 'images']
          },
          {
            model: Order,
            attributes: [],
            where: {
              createdAt: {
                [Op.between]: [startDate, endDate]
              },
              orderStatus: {
                [Op.notIn]: ['cancelled']
              }
            }
          }
        ],
        group: ['ProductId', 'Product.id'],
        order: [[fn('SUM', literal('quantity * price')), 'DESC']],
        limit: parseInt(limit)
      });

      // Get low performing products
      const lowPerformingProducts = await OrderItem.findAll({
        attributes: [
          'ProductId',
          [fn('SUM', col('quantity')), 'totalSold'],
          [fn('SUM', literal('quantity * price')), 'totalRevenue']
        ],
        include: [
          {
            model: Product,
            attributes: ['name', 'category', 'brand', 'price', 'stock']
          },
          {
            model: Order,
            attributes: [],
            where: {
              createdAt: {
                [Op.between]: [startDate, endDate]
              },
              orderStatus: {
                [Op.notIn]: ['cancelled']
              }
            }
          }
        ],
        group: ['ProductId', 'Product.id'],
        order: [[fn('SUM', col('quantity')), 'ASC']],
        limit: parseInt(limit)
      });

      return {
        topProducts: topProducts.map(item => ({
          product: item.Product,
          totalSold: parseInt(item.dataValues.totalSold),
          totalRevenue: parseFloat(item.dataValues.totalRevenue),
          orderCount: parseInt(item.dataValues.orderCount)
        })),
        lowPerformingProducts: lowPerformingProducts.map(item => ({
          product: item.Product,
          totalSold: parseInt(item.dataValues.totalSold),
          totalRevenue: parseFloat(item.dataValues.totalRevenue)
        }))
      };
    } catch (error) {
      console.error('Error generating product performance report:', error);
      throw error;
    }
  }

  // Customer Analytics
  static async getCustomerAnalytics(startDate, endDate) {
    try {
      // New customers
      const newCustomers = await User.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          },
          role: 'customer'
        }
      });

      // Customer lifetime value
      const customerLTV = await User.findAll({
        attributes: [
          'id',
          'name',
          'email',
          'createdAt',
          [fn('COUNT', col('Orders.id')), 'totalOrders'],
          [fn('SUM', col('Orders.totalAmount')), 'totalSpent'],
          [fn('AVG', col('Orders.totalAmount')), 'averageOrderValue']
        ],
        include: [
          {
            model: Order,
            attributes: [],
            where: {
              orderStatus: {
                [Op.notIn]: ['cancelled']
              }
            },
            required: true
          }
        ],
        where: {
          role: 'customer'
        },
        group: ['User.id'],
        order: [[fn('SUM', col('Orders.totalAmount')), 'DESC']],
        limit: 20
      });

      // Customer segments
      const customerSegments = await sequelize.query(`
        SELECT 
          CASE 
            WHEN total_spent >= 1000 THEN 'VIP'
            WHEN total_spent >= 500 THEN 'Premium'
            WHEN total_spent >= 100 THEN 'Regular'
            ELSE 'New'
          END as segment,
          COUNT(*) as customer_count,
          AVG(total_spent) as avg_spent
        FROM (
          SELECT 
            u.id,
            COALESCE(SUM(o.totalAmount), 0) as total_spent
          FROM Users u
          LEFT JOIN Orders o ON u.id = o.UserId AND o.orderStatus != 'cancelled'
          WHERE u.role = 'customer'
          GROUP BY u.id
        ) customer_totals
        GROUP BY segment
        ORDER BY avg_spent DESC
      `, { type: sequelize.QueryTypes.SELECT });

      // Repeat customers
      const repeatCustomers = await sequelize.query(`
        SELECT COUNT(*) as repeat_customers
        FROM (
          SELECT UserId, COUNT(*) as order_count
          FROM Orders 
          WHERE orderStatus != 'cancelled'
          AND createdAt BETWEEN :startDate AND :endDate
          GROUP BY UserId
          HAVING COUNT(*) > 1
        ) repeat_orders
      `, {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      });

      return {
        newCustomers,
        customerLTV: customerLTV.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          joinDate: customer.createdAt,
          totalOrders: parseInt(customer.dataValues.totalOrders),
          totalSpent: parseFloat(customer.dataValues.totalSpent || 0),
          averageOrderValue: parseFloat(customer.dataValues.averageOrderValue || 0)
        })),
        customerSegments: customerSegments.map(segment => ({
          segment: segment.segment,
          customerCount: parseInt(segment.customer_count),
          averageSpent: parseFloat(segment.avg_spent || 0)
        })),
        repeatCustomers: parseInt(repeatCustomers[0].repeat_customers || 0)
      };
    } catch (error) {
      console.error('Error generating customer analytics:', error);
      throw error;
    }
  }

  // Category Performance
  static async getCategoryPerformance(startDate, endDate) {
    try {
      const categoryData = await OrderItem.findAll({
        attributes: [
          [col('Product.category'), 'category'],
          [fn('SUM', col('quantity')), 'totalSold'],
          [fn('SUM', literal('quantity * price')), 'totalRevenue'],
          [fn('COUNT', fn('DISTINCT', col('OrderId'))), 'orderCount'],
          [fn('AVG', col('price')), 'averagePrice']
        ],
        include: [
          {
            model: Product,
            attributes: []
          },
          {
            model: Order,
            attributes: [],
            where: {
              createdAt: {
                [Op.between]: [startDate, endDate]
              },
              orderStatus: {
                [Op.notIn]: ['cancelled']
              }
            }
          }
        ],
        group: [col('Product.category')],
        order: [[fn('SUM', literal('quantity * price')), 'DESC']]
      });

      return categoryData.map(item => ({
        category: item.dataValues.category,
        totalSold: parseInt(item.dataValues.totalSold),
        totalRevenue: parseFloat(item.dataValues.totalRevenue),
        orderCount: parseInt(item.dataValues.orderCount),
        averagePrice: parseFloat(item.dataValues.averagePrice)
      }));
    } catch (error) {
      console.error('Error generating category performance report:', error);
      throw error;
    }
  }

  // Revenue Tracking by Time Periods
  static async getRevenueTracking(period = 'month', limit = 12) {
    try {
      let dateFormat, dateUnit;
      
      switch (period) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          dateUnit = 'DAY';
          break;
        case 'week':
          dateFormat = '%Y-%u';
          dateUnit = 'WEEK';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          dateUnit = 'MONTH';
          break;
        case 'year':
          dateFormat = '%Y';
          dateUnit = 'YEAR';
          break;
        default:
          dateFormat = '%Y-%m';
          dateUnit = 'MONTH';
      }

      const revenueData = await Order.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'period'],
          [fn('SUM', col('totalAmount')), 'revenue'],
          [fn('COUNT', col('id')), 'orders']
        ],
        where: {
          orderStatus: {
            [Op.notIn]: ['cancelled']
          },
          createdAt: {
            [Op.gte]: literal(`DATE_SUB(NOW(), INTERVAL ${limit} ${dateUnit})`)
          }
        },
        group: [fn('DATE_FORMAT', col('createdAt'), dateFormat)],
        order: [[fn('DATE_FORMAT', col('createdAt'), dateFormat), 'DESC']],
        limit: parseInt(limit),
        raw: true
      });

      return revenueData.map(item => ({
        period: item.period,
        revenue: parseFloat(item.revenue || 0),
        orders: parseInt(item.orders)
      })).reverse();
    } catch (error) {
      console.error('Error generating revenue tracking report:', error);
      throw error;
    }
  }

  // Dashboard Summary
  static async getDashboardSummary() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      // Today's stats
      const todayStats = await Order.findOne({
        attributes: [
          [fn('COUNT', col('id')), 'orders'],
          [fn('SUM', col('totalAmount')), 'revenue']
        ],
        where: {
          createdAt: {
            [Op.gte]: today.toISOString().split('T')[0]
          },
          orderStatus: {
            [Op.notIn]: ['cancelled']
          }
        },
        raw: true
      });

      // This month stats
      const thisMonthStats = await Order.findOne({
        attributes: [
          [fn('COUNT', col('id')), 'orders'],
          [fn('SUM', col('totalAmount')), 'revenue']
        ],
        where: {
          createdAt: {
            [Op.gte]: thisMonth
          },
          orderStatus: {
            [Op.notIn]: ['cancelled']
          }
        },
        raw: true
      });

      // Last month stats for comparison
      const lastMonthStats = await Order.findOne({
        attributes: [
          [fn('COUNT', col('id')), 'orders'],
          [fn('SUM', col('totalAmount')), 'revenue']
        ],
        where: {
          createdAt: {
            [Op.between]: [lastMonth, lastMonthEnd]
          },
          orderStatus: {
            [Op.notIn]: ['cancelled']
          }
        },
        raw: true
      });

      // Total customers
      const totalCustomers = await User.count({
        where: { role: 'customer' }
      });

      // Total products
      const totalProducts = await Product.count();

      // Low stock products
      const lowStockProducts = await Product.count({
        where: { stock: { [Op.lte]: 5, [Op.gt]: 0 } }
      });

      // Out of stock products
      const outOfStockProducts = await Product.count({
        where: { stock: 0 }
      });

      // Recent reviews
      const recentReviews = await Review.findAll({
        include: [
          {
            model: Product,
            attributes: ['name']
          },
          {
            model: User,
            attributes: ['name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      return {
        today: {
          orders: parseInt(todayStats.orders || 0),
          revenue: parseFloat(todayStats.revenue || 0)
        },
        thisMonth: {
          orders: parseInt(thisMonthStats.orders || 0),
          revenue: parseFloat(thisMonthStats.revenue || 0)
        },
        lastMonth: {
          orders: parseInt(lastMonthStats.orders || 0),
          revenue: parseFloat(lastMonthStats.revenue || 0)
        },
        growth: {
          orders: lastMonthStats.orders > 0 
            ? ((thisMonthStats.orders - lastMonthStats.orders) / lastMonthStats.orders * 100).toFixed(2)
            : 0,
          revenue: lastMonthStats.revenue > 0 
            ? ((thisMonthStats.revenue - lastMonthStats.revenue) / lastMonthStats.revenue * 100).toFixed(2)
            : 0
        },
        inventory: {
          totalProducts,
          lowStockProducts,
          outOfStockProducts
        },
        totalCustomers,
        recentReviews: recentReviews.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          productName: review.Product.name,
          customerName: review.User.name,
          createdAt: review.createdAt
        }))
      };
    } catch (error) {
      console.error('Error generating dashboard summary:', error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;