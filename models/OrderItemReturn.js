const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const OrderItem = require("./OrderItem");
const Order = require("./Order");

const OrderItemReturn = sequelize.define("OrderItemReturn", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Number of items being returned"
  },
  reason: {
    type: DataTypes.ENUM(
      "defective",
      "wrong_item",
      "not_as_described",
      "changed_mind",
      "damaged",
      "expired",
      "other"
    ),
    allowNull: false,
  },
  reasonDetails: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("requested", "approved", "rejected", "picked_up", "received", "refunded"),
    defaultValue: "requested",
  },
  refundAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Images of defective/damaged items"
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
OrderItemReturn.belongsTo(OrderItem);
OrderItem.hasMany(OrderItemReturn);

OrderItemReturn.belongsTo(Order);
Order.hasMany(OrderItemReturn);

module.exports = OrderItemReturn;