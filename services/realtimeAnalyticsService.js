const { Op, fn, col } = require('sequelize');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

class RealtimeAnalyticsService {
  constructor(io) {
    this.io = io;
    this.activeConnections = new Set();
    this.setupSocketHandlers();
    this.startRealtimeUpdates();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Analytics client connected:', socket.id);
      this.activeConnections.add(socket.id);

      // Send initial data on connection
      this.sendInitialData(socket);

      socket.on('disconnect', () => {
        console.log('Analytics client disconnected:', socket.id);
        this.activeConnections.delete(socket.id);
      });

      socket.on('request-update', () => {
        this.sendRealtimeUpdate(socket);
      });
    });
  }

  async sendInitialData(socket) {
    try {
      const data = await this.getRealtimeData();
      socket.emit('analytics-update', data);
    } catch (error) {
      console.error('Error sending initial analytics data:', error);
    }
  }

  async sendRealtimeUpdate(socket) {
    try {
      const data = await this.getRealtimeData();
      socket.emit('analytics-update', data);
    } catch (error) {
      console.error('Error sending realtime analytics update:', error);
    }
  }

  startRealtimeUpdates() {
    // Send updates every 30 seconds to all connected clients
    setInterval(async () => {
      if (this.activeConnections.size > 0) {
        try {
          const data = await this.getRealtimeData();
          this.io.emit('analytics-update', data);
        } catch (error) {
          console.error('Error in realtime analytics update:', error);
        }
      }
    }, 30000); // 30 seconds
  }

  async getRealtimeData() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    // Today's orders
    const todayOrders = await Order.count({
      where: {
        createdAt: { [Op.gte]: todayStart },
        orderStatus: { [Op.notIn]: ['cancelled'] }
      }
    });

    // Today's revenue
    const todayRevenue = await Order.sum('totalAmount', {
      where: {
        createdAt: { [Op.gte]: todayStart },
        orderStatus: { [Op.notIn]: ['cancelled'] }
      }
    });

    // Last hour orders
    const lastHourOrders = await Order.count({
      where: {
        createdAt: { [Op.gte]: lastHour },
        orderStatus: { [Op.notIn]: ['cancelled'] }
      }
    });

    // Pending orders
    const pendingOrders = await Order.count({
      where: {
        orderStatus: { [Op.in]: ['placed', 'processing'] }
      }
    });

    // Active customers (ordered in last 24 hours)
    const activeCustomers = await Order.count({
      distinct: true,
      col: 'UserId',
      where: {
        createdAt: { [Op.gte]: last24Hours }
      }
    });

    // Low stock alerts
    const lowStockCount = await Product.count({
      where: {
        stock: { [Op.lte]: 5, [Op.gt]: 0 }
      }
    });

    // Recent orders (last 10)
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'totalAmount', 'orderStatus', 'createdAt']
    });

    return {
      timestamp: now,
      today: {
        orders: todayOrders,
        revenue: parseFloat(todayRevenue || 0)
      },
      lastHour: {
        orders: lastHourOrders
      },
      pending: {
        orders: pendingOrders
      },
      activeCustomers,
      alerts: {
        lowStock: lowStockCount
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customerName: order.User.name,
        amount: order.totalAmount,
        status: order.orderStatus,
        createdAt: order.createdAt
      }))
    };
  }

  // Emit event when new order is created
  async onNewOrder(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: User, attributes: ['name'] }]
      });

      if (order) {
        this.io.emit('new-order', {
          id: order.id,
          customerName: order.User.name,
          amount: order.totalAmount,
          status: order.orderStatus,
          createdAt: order.createdAt
        });

        // Send updated analytics
        const data = await this.getRealtimeData();
        this.io.emit('analytics-update', data);
      }
    } catch (error) {
      console.error('Error emitting new order event:', error);
    }
  }

  // Emit event when order status changes
  async onOrderStatusChange(orderId, newStatus) {
    try {
      this.io.emit('order-status-change', {
        orderId,
        newStatus,
        timestamp: new Date()
      });

      // Send updated analytics
      const data = await this.getRealtimeData();
      this.io.emit('analytics-update', data);
    } catch (error) {
      console.error('Error emitting order status change event:', error);
    }
  }

  // Emit event when stock is low
  async onLowStock(productId, productName, currentStock) {
    try {
      this.io.emit('low-stock-alert', {
        productId,
        productName,
        currentStock,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error emitting low stock alert:', error);
    }
  }
}

module.exports = RealtimeAnalyticsService;