const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Order = sequelize.define("Order", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "UserId",
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true,
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

Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

Object.defineProperty(Order.prototype, "UserId", {
  get() {
    return this.getDataValue("userId");
  },
  set(value) {
    this.setDataValue("userId", value);
  },
});

module.exports = Order;
