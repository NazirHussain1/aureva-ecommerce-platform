const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductBundle = sequelize.define("ProductBundle", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bundlePrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: "Special bundle price (usually discounted)"
  },
  originalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: "Sum of individual product prices"
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: "Discount percentage"
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Available bundle quantity"
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { 
  timestamps: true 
});

module.exports = ProductBundle;