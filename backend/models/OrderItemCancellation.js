const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const OrderItem = require("./OrderItem");
const Order = require("./Order");

const OrderItemCancellation = sequelize.define("OrderItemCancellation", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Number of items being cancelled"
  },
  reason: {
    type: DataTypes.ENUM(
      "out_of_stock",
      "price_changed",
      "changed_mind",
      "ordered_by_mistake",
      "found_better_price",
      "delivery_delay",
      "other"
    ),
    allowNull: false,
  },
  reasonDetails: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("requested", "approved", "rejected", "refunded"),
    defaultValue: "requested",
  },
  refundAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  approvedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  refundedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { 
  timestamps: true 
});

// Associations
OrderItemCancellation.belongsTo(OrderItem);
OrderItem.hasMany(OrderItemCancellation);

OrderItemCancellation.belongsTo(Order);
Order.hasMany(OrderItemCancellation);

module.exports = OrderItemCancellation;