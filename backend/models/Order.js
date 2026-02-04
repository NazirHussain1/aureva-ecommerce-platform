const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Order = sequelize.define("Order", {
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },
  orderStatus: {
    type: DataTypes.ENUM("placed", "processing", "shipped", "delivered", "cancelled", "returned"),
    defaultValue: "placed",
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  },
  returnRequestDate: {
    type: DataTypes.DATE,
  },
  cancelReason: {
    type: DataTypes.STRING,
  },
  returnReason: {
    type: DataTypes.STRING,
  },
}, { 
  timestamps: true 
});

Order.belongsTo(User);
User.hasMany(Order);

module.exports = Order;
