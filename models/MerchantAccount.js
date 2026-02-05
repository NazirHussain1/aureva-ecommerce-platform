const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MerchantAccount = sequelize.define("MerchantAccount", {
  accountType: {
    type: DataTypes.ENUM("jazzcash", "easypaisa", "bank_account"),
    allowNull: false,
  },
  accountTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Account holder name"
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Mobile number for JazzCash/EasyPaisa or Account number for bank"
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Bank name (only for bank_account type)"
  },
  branchCode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Branch code (only for bank_account type)"
  },
  iban: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "IBAN number (only for bank_account type)"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Admin verification status"
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Primary account for receiving payments"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, { 
  timestamps: true 
});

module.exports = MerchantAccount;