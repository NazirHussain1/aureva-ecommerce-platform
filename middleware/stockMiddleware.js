const NotificationService = require("../services/notificationService");
const Product = require("../models/Product");

// Middleware to check stock levels after product updates
const checkLowStock = async (productId, newStock) => {
  try {
    const lowStockThreshold = 5;
    
    if (newStock <= lowStockThreshold && newStock > 0) {
      const product = await Product.findByPk(productId);
      if (product) {
        await NotificationService.createLowStockAlert(
          product.id,
          product.name,
          newStock,
          lowStockThreshold
        );
      }
    }
  } catch (error) {
    console.error("Error checking low stock:", error);
  }
};

module.exports = { checkLowStock };