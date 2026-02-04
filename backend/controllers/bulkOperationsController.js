const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { Op } = require("sequelize");
const NotificationService = require("../services/notificationService");

// Bulk update product prices
const bulkUpdatePrices = async (req, res) => {
  try {
    const { updates, operation = 'set' } = req.body;
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    let updatedCount = 0;

    for (const update of updates) {
      const { productId, value, percentage } = update;
      
      const product = await Product.findByPk(productId);
      if (!product) continue;

      let newPrice;
      
      switch (operation) {
        case 'increase':
          newPrice = percentage 
            ? product.price * (1 + percentage / 100)
            : product.price + value;
          break;
        case 'decrease':
          newPrice = percentage 
            ? product.price * (1 - percentage / 100)
            : product.price - value;
          break;
        case 'set':
        default:
          newPrice = value;
          break;
      }

      // Ensure price doesn't go below 0
      newPrice = Math.max(0.01, newPrice);

      await product.update({ price: newPrice });
      updatedCount++;
    }

    res.json({
      message: `${updatedCount} products updated successfully`,
      updatedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk update product stock
const bulkUpdateStock = async (req, res) => {
  try {
    const { updates, operation = 'set' } = req.body;
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    let updatedCount = 0;
    const lowStockProducts = [];

    for (const update of updates) {
      const { productId, value } = update;
      
      const product = await Product.findByPk(productId);
      if (!product) continue;

      let newStock;
      
      switch (operation) {
        case 'increase':
          newStock = product.stock + value;
          break;
        case 'decrease':
          newStock = product.stock - value;
          break;
        case 'set':
        default:
          newStock = value;
          break;
      }

      // Ensure stock doesn't go below 0
      newStock = Math.max(0, newStock);

      await product.update({ stock: newStock });
      updatedCount++;

      // Check for low stock
      if (newStock <= 5 && newStock > 0) {
        lowStockProducts.push({
          id: product.id,
          name: product.name,
          stock: newStock
        });
      }
    }

    // Send low stock notifications
    for (const product of lowStockProducts) {
      await NotificationService.createLowStockAlert(
        product.id,
        product.name,
        product.stock
      );
    }

    res.json({
      message: `${updatedCount} products updated successfully`,
      updatedCount,
      lowStockAlerts: lowStockProducts.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk update product categories
const bulkUpdateCategories = async (req, res) => {
  try {
    const { productIds, newCategory } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs array is required" });
    }

    if (!newCategory) {
      return res.status(400).json({ message: "New category is required" });
    }

    const [updatedCount] = await Product.update(
      { category: newCategory },
      { 
        where: { 
          id: { [Op.in]: productIds } 
        } 
      }
    );

    res.json({
      message: `${updatedCount} products updated to category: ${newCategory}`,
      updatedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk delete products
const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs array is required" });
    }

    const deletedCount = await Product.destroy({
      where: { 
        id: { [Op.in]: productIds } 
      }
    });

    res.json({
      message: `${deletedCount} products deleted successfully`,
      deletedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk update order status
const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, newStatus } = req.body;
    
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: "Order IDs array is required" });
    }

    const validStatuses = ["placed", "processing", "shipped", "delivered", "cancelled", "returned"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Get orders with user information for notifications
    const orders = await Order.findAll({
      where: { id: { [Op.in]: orderIds } },
      include: [{ model: User }]
    });

    let updatedCount = 0;

    for (const order of orders) {
      const oldStatus = order.orderStatus;
      
      if (newStatus === "delivered") {
        await order.update({ 
          orderStatus: newStatus,
          deliveredAt: new Date()
        });
      } else {
        await order.update({ orderStatus: newStatus });
      }

      // Send notification if status changed
      if (oldStatus !== newStatus) {
        await NotificationService.createOrderStatusNotification(
          order.User.id,
          order.id,
          newStatus
        );
      }

      updatedCount++;
    }

    res.json({
      message: `${updatedCount} orders updated to status: ${newStatus}`,
      updatedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export products to CSV
const exportProducts = async (req, res) => {
  try {
    const { category, brand, inStock } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (inStock === 'true') filter.stock = { [Op.gt]: 0 };

    const products = await Product.findAll({
      where: filter,
      attributes: ['id', 'name', 'description', 'price', 'stock', 'category', 'brand', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // Convert to CSV format
    const csvHeader = 'ID,Name,Description,Price,Stock,Category,Brand,Created At\n';
    const csvData = products.map(product => 
      `${product.id},"${product.name}","${product.description}",${product.price},${product.stock},"${product.category}","${product.brand || ''}","${product.createdAt}"`
    ).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  bulkUpdatePrices,
  bulkUpdateStock,
  bulkUpdateCategories,
  bulkDeleteProducts,
  bulkUpdateOrderStatus,
  exportProducts
};