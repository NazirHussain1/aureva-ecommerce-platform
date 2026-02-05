const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ProductBundle = require("./ProductBundle");
const Product = require("./Product");

const BundleItem = sequelize.define("BundleItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: "Quantity of this product in the bundle"
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Whether customer can choose to exclude this item"
  },
}, { 
  timestamps: true 
});

// Associations
BundleItem.belongsTo(ProductBundle);
ProductBundle.hasMany(BundleItem);

BundleItem.belongsTo(Product);
Product.hasMany(BundleItem);

module.exports = BundleItem;