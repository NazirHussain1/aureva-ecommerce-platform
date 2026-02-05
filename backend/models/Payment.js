const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Order = require("./Order");

const Payment = sequelize.define("Payment", {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("credit_card", "debit_card", "paypal", "stripe", "razorpay", "cash_on_delivery"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
    defaultValue: "pending",
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
  },
  paymentGatewayResponse: {
    type: DataTypes.JSON,
  },
  refundAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  refundReason: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

Payment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Payment, { foreignKey: "userId" });

Payment.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(Payment, { foreignKey: "orderId" });

module.exports = Payment;