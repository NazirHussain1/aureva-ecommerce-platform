const { Op } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("../models/Product");

const getLowStockProducts = async (req, res) => {
  const products = await Product.findAll({
    where: {
      stock: {
        [Op.lte]: sequelize.col("lowStockThreshold"),
      },
    },
  });

  res.json(products);
};

module.exports = { getLowStockProducts };