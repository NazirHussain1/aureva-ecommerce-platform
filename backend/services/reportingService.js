const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

class ReportingService {
  // Advanced Sales Report with Comparisons
  static async getAdvancedSalesReport(startDate, endDate, compareWith = null) {
    try {
      const currentPeriodData = await this.getSalesPeriodData(startDate, endDate);
      
      let comparison = null;
      if (compareWith) {
        const comparePeriodData = await this.getSalesPeriodData(compareWith.startDate, compareWith.endDate);
        comparison = {
          period: compareWith,
          data: comparePeriodData,
          growth: {
            revenue: this.calculateGrowth(comparePeriodData.totalRevenue, currentPeriodData.totalRevenue),
            orders: this.calculateGrowth(comparePeriodData.totalOrders, currentPeriodData.totalOrders),
            averageOrderValue: this.calculateGrowth(comparePeriodData.averageOrderValue, currentPeriodData.averageOrderValue)
          }
        };
      }

      return {
        currentPeriod: {
          startDate,
          endDate,
          data: currentPeriodData
        },
        comparison
      };
    } catch (error) {
      console.error('Error generating advanced sales report:', error);
      throw error;
    }
  }

  static async getSalesPeriodData(startDate, endDate) {
    const salesData = await Order.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'totalOrders'],
        [fn('SUM', col('totalAmount')), 'totalRevenue'],
        [fn('AVG', col('totalAmount')), 'averageOrderValue'],
        [fn('MIN', col('totalAmount')), 'minOrderValue'],
        [fn('MAX', col('totalAmount')), 'maxOrderValue']
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        orderStatus: { [Op.notIn]: ['cancelled'] }
      },
      raw: true
    });

    // Get order status breakdown
    const statusBreakdown = await Order.findAll({
      attributes: [
        'orderStatus',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      group: ['orderStatus'],
      raw: true
    });

    return {
      totalOrders: parseInt(salesData.totalOrders || 0),
      totalRevenue: parseFloat(salesData.totalRevenue || 0),
      averageOrderValue: parseFloat(salesData.averageOrderValue || 0),
      minOrderValue: parseFloat(salesData.minOrderValue || 0),
      maxOrderValue: parseFloat(salesData.maxOrderValue || 0),
      statusBreakdown: statusBreakdown.map(item => ({
        status: item.orderStatus,
        count: parseInt(item.count),
        revenue: parseFloat(item.revenue || 0)
      }))
    };
  }

  // Customer Segmentation Report
  static async getCustomerSegmentationReport() {
    try {
      const segments = await sequelize.query(`
        SELECT 
          customer_segment,
          COUNT(*) as customer_count,
          AVG(total_spent) as avg_spent,
          AVG(total_orders) as avg_orders,
          SUM(total_spent) as segment_revenue
        FROM (
          SELECT 
            u.id,
            u.name,
            u.email,
            u.createdAt,
            COALESCE(SUM(o.totalAmount), 0) as total_spent,
            COUNT(o.id) as total_orders,
            CASE 
              WHEN COUNT(o.id) = 0 THEN 'Inactive'
              WHEN COUNT(o.id) = 1 THEN 'One-time'
              WHEN COUNT(o.id) BETWEEN 2 AND 5 THEN 'Regular'
              WHEN COUNT(o.id) BETWEEN 6 AND 10 THEN 'Loyal'
              ELSE 'VIP'
            END as customer_segment
          FROM Users u
          LEFT JOIN Orders o ON u.id = o.UserId AND o.orderStatus != 'cancelled'
          WHERE u.role = 'customer'
          GROUP BY u.id, u.name, u.email, u.createdAt
        ) customer_data
        GROUP BY customer_segment
        ORDER BY avg_spent DESC
      `, { type: sequelize.QueryTypes.SELECT });

      // Get detailed customer data for each segment
      const detailedSegments = await Promise.all(
        segments.map(async (segment) => {
          const customers = await sequelize.query(`
            SELECT 
              u.id,
              u.name,
              u.email,
              u.createdAt as join_date,
              COALESCE(SUM(o.totalAmount), 0) as total_spent,
              COUNT(o.id) as total_orders,
              MAX(o.createdAt) as last_order_date
            FROM Users u
            LEFT JOIN Orders o ON u.id = o.UserId AND o.orderStatus != 'cancelled'
            WHERE u.role = 'customer'
            GROUP BY u.id, u.name, u.email, u.createdAt
            HAVING CASE 
              WHEN COUNT(o.id) = 0 THEN 'Inactive'
              WHEN COUNT(o.id) = 1 THEN 'One-time'
              WHEN COUNT(o.id) BETWEEN 2 AND 5 THEN 'Regular'
              WHEN COUNT(o.id) BETWEEN 6 AND 10 THEN 'Loyal'
              ELSE 'VIP'
            END = :segment
            ORDER BY total_spent DESC
            LIMIT 10
          `, {
            replacements: { segment: segment.customer_segment },
            type: sequelize.QueryTypes.SELECT
          });

          return {
            ...segment,
            customer_count: parseInt(segment.customer_count),
            avg_spent: parseFloat(segment.avg_spent || 0),
            avg_orders: parseFloat(segment.avg_orders || 0),
            segment_revenue: parseFloat(segment.segment_revenue || 0),
            top_customers: customers.map(customer => ({
              ...customer,
              total_spent: parseFloat(customer.total_spent),
              total_orders: parseInt(customer.total_orders)
            }))
          };
        })
      );

      return detailedSegments;
    } catch (error) {
      console.error('Error generating customer segmentation report:', error);
      throw error;
    }
  }

  // Product Profitability Report
  static async getProductProfitabilityReport(startDate, endDate) {
    try {
      const productData = await OrderItem.findAll({
        attributes: [
          'ProductId',
          [fn('SUM', col('quantity')), 'totalSold'],
          [fn('SUM', literal('quantity * price')), 'totalRevenue'],
          [fn('AVG', col('price')), 'averagePrice'],
          [fn('COUNT', fn('DISTINCT', col('OrderId'))), 'orderCount']
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
              createdAt: { [Op.between]: [startDate, endDate] },
              orderStatus: { [Op.notIn]: ['cancelled'] }
            }
          }
        ],
        group: ['ProductId', 'Product.id'],
        order: [[fn('SUM', literal('quantity * price')), 'DESC']]
      });

      // Calculate profitability metrics
      const profitabilityData = productData.map(item => {
        const totalSold = parseInt(item.dataValues.totalSold);
        const totalRevenue = parseFloat(item.dataValues.totalRevenue);
        const averagePrice = parseFloat(item.dataValues.averagePrice);
        const orderCount = parseInt(item.dataValues.orderCount);

        // Calculate metrics
        const revenuePerUnit = totalRevenue / totalSold;
        const ordersPerUnit = totalSold / orderCount;
        const conversionRate = (orderCount / totalSold) * 100;

        return {
          product: item.Product,
          metrics: {
            totalSold,
            totalRevenue,
            averagePrice,
            orderCount,
            revenuePerUnit,
            ordersPerUnit,
            conversionRate: parseFloat(conversionRate.toFixed(2))
          }
        };
      });

      return profitabilityData;
    } catch (error) {
      console.error('Error generating product profitability report:', error);
      throw error;
    }
  }

  // Inventory Analysis Report
  static async getInventoryAnalysisReport() {
    try {
      // Stock levels analysis
      const stockAnalysis = await Product.findAll({
        attributes: [
          'category',
          [fn('COUNT', col('id')), 'totalProducts'],
          [fn('SUM', col('stock')), 'totalStock'],
          [fn('AVG', col('stock')), 'averageStock'],
          [fn('COUNT', literal('CASE WHEN stock = 0 THEN 1 END')), 'outOfStock'],
          [fn('COUNT', literal('CASE WHEN stock <= 5 AND stock > 0 THEN 1 END')), 'lowStock']
        ],
        group: ['category'],
        order: [['category', 'ASC']],
        raw: true
      });

      // Products needing attention
      const criticalProducts = await Product.findAll({
        where: {
          [Op.or]: [
            { stock: 0 },
            { stock: { [Op.lte]: 5, [Op.gt]: 0 } }
          ]
        },
        order: [['stock', 'ASC']],
        limit: 20
      });

      // Fast-moving products (based on recent sales)
      const fastMovingProducts = await OrderItem.findAll({
        attributes: [
          'ProductId',
          [fn('SUM', col('quantity')), 'totalSold']
        ],
        include: [
          {
            model: Product,
            attributes: ['name', 'category', 'stock', 'price']
          },
          {
            model: Order,
            attributes: [],
            where: {
              createdAt: { [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 30 DAY)') },
              orderStatus: { [Op.notIn]: ['cancelled'] }
            }
          }
        ],
        group: ['ProductId', 'Product.id'],
        order: [[fn('SUM', col('quantity')), 'DESC']],
        limit: 10
      });

      return {
        stockAnalysis: stockAnalysis.map(item => ({
          category: item.category,
          totalProducts: parseInt(item.totalProducts),
          totalStock: parseInt(item.totalStock || 0),
          averageStock: parseFloat(item.averageStock || 0),
          outOfStock: parseInt(item.outOfStock || 0),
          lowStock: parseInt(item.lowStock || 0)
        })),
        criticalProducts: criticalProducts.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          stock: product.stock,
          status: product.stock === 0 ? 'Out of Stock' : 'Low Stock'
        })),
        fastMovingProducts: fastMovingProducts.map(item => ({
          product: item.Product,
          totalSold: parseInt(item.dataValues.totalSold),
          stockTurnover: item.Product.stock > 0 ? 
            (parseInt(item.dataValues.totalSold) / item.Product.stock).toFixed(2) : 'N/A'
        }))
      };
    } catch (error) {
      console.error('Error generating inventory analysis report:', error);
      throw error;
    }
  }

  // Customer Lifetime Value Report
  static async getCustomerLTVReport(limit = 50) {
    try {
      const customerLTV = await User.findAll({
        attributes: [
          'id',
          'name',
          'email',
          'createdAt',
          [fn('COUNT', col('Orders.id')), 'totalOrders'],
          [fn('SUM', col('Orders.totalAmount')), 'totalSpent'],
          [fn('AVG', col('Orders.totalAmount')), 'averageOrderValue'],
          [fn('MAX', col('Orders.createdAt')), 'lastOrderDate'],
          [fn('MIN', col('Orders.createdAt')), 'firstOrderDate']
        ],
        include: [
          {
            model: Order,
            attributes: [],
            where: { orderStatus: { [Op.notIn]: ['cancelled'] } },
            required: true
          }
        ],
        where: { role: 'customer' },
        group: ['User.id'],
        order: [[fn('SUM', col('Orders.totalAmount')), 'DESC']],
        limit: parseInt(limit)
      });

      // Calculate additional metrics
      const ltvData = customerLTV.map(customer => {
        const totalOrders = parseInt(customer.dataValues.totalOrders);
        const totalSpent = parseFloat(customer.dataValues.totalSpent || 0);
        const averageOrderValue = parseFloat(customer.dataValues.averageOrderValue || 0);
        const firstOrderDate = new Date(customer.dataValues.firstOrderDate);
        const lastOrderDate = new Date(customer.dataValues.lastOrderDate);
        const customerLifespan = Math.ceil((lastOrderDate - firstOrderDate) / (1000 * 60 * 60 * 24));
        const orderFrequency = customerLifespan > 0 ? totalOrders / customerLifespan : 0;

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          joinDate: customer.createdAt,
          totalOrders,
          totalSpent,
          averageOrderValue,
          firstOrderDate,
          lastOrderDate,
          customerLifespan,
          orderFrequency: parseFloat(orderFrequency.toFixed(4)),
          predictedLTV: totalSpent * (1 + orderFrequency) // Simple LTV prediction
        };
      });

      return ltvData;
    } catch (error) {
      console.error('Error generating customer LTV report:', error);
      throw error;
    }
  }

  // Helper method to calculate growth percentage
  static calculateGrowth(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return parseFloat(((newValue - oldValue) / oldValue * 100).toFixed(2));
  }
}

module.exports = ReportingService;