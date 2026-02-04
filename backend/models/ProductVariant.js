const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./Product");

const ProductVariant = sequelize.define("ProductVariant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("size", "color", "material", "scent", "volume"),
    allowNull: false,
  },
  priceAdjustment: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    comment: "Price difference from base product (can be negative)"
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, { 
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['ProductId', 'type', 'value']
    }
  ]
});

// Associations
ProductVariant.belongsTo(Product);
Product.hasMany(ProductVariant);

module.exports = ProductVariant;