const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Coupon = sequelize.define(
  "Coupon",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    discountType: {
      type: DataTypes.ENUM("percentage", "flat"),
      allowNull: false,
    },

    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    minOrderAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    maxDiscount: {
      type: DataTypes.FLOAT,
    },

    expiresAt: {
      type: DataTypes.DATE,
    },

    usageLimit: {
      type: DataTypes.INTEGER,
    },

    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true }
);

module.exports = Coupon;
