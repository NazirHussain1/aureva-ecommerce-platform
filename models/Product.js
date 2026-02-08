const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { 
      type: DataTypes.ENUM(
        "skincare",
        "haircare",
        "makeup",
        "fragrance",
        "men",
        "women",
        "kids",
        "wellness"
      ), 
      allowNull: false 
    },
    price: { type: DataTypes.FLOAT, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    description: { type: DataTypes.TEXT },
    ingredients: { type: DataTypes.TEXT },
    usage: { type: DataTypes.TEXT },
    images: { type: DataTypes.JSON }, 
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

module.exports = Product;
