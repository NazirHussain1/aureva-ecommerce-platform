const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Notification = sequelize.define("Notification", {
  type: {
    type: DataTypes.ENUM("order_status", "low_stock", "system", "promotion"),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, { 
  timestamps: true 
});

Notification.belongsTo(User);
User.hasMany(Notification);

module.exports = Notification;
