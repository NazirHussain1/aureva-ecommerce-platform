const Product = require("../models/Product");

const getLowStockProducts = async (req, res) => {
  try {
    const lowStockThreshold = Number(req.query.threshold) || 5;
    const products = await Product.find({
      stock: { $gt: 0, $lte: lowStockThreshold },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock products" });
  }
};

module.exports = { getLowStockProducts };
