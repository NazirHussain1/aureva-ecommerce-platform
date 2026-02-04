const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Newsletter = sequelize.define("Newsletter", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isSubscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  subscribedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = Newsletter;