const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./Order");
const User = require("./User");
const MerchantAccount = require("./MerchantAccount");

const Payment = sequelize.define("Payment", {
  paymentMethod: {
    type: DataTypes.ENUM("jazzcash", "easypaisa", "bank_transfer", "cash_on_delivery"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "processing", "completed", "failed", "refunded"),
    defaultValue: "pending",
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: "Transaction ID from payment gateway or bank"
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Name of person who made the payment"
  },
  senderAccount: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Mobile number or account number of sender"
  },
  receiverAccount: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Merchant account that received payment"
  },
  paymentProof: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Screenshot or proof of payment (image URLs)"
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Date when payment was made by customer"
  },
  verifiedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Date when payment was verified by admin"
  },
  verifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Admin user ID who verified the payment"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refundDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { 
  timestamps: true 
});

// Associations
Payment.belongsTo(Order);
Order.hasMany(Payment);

Payment.belongsTo(User);
User.hasMany(Payment);

Payment.belongsTo(MerchantAccount, { foreignKey: 'MerchantAccountId', allowNull: true });
MerchantAccount.hasMany(Payment);

module.exports = Payment;