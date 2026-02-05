const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Notification = sequelize.define("Notification", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("order", "payment", "product", "system", "promotion"),
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  actionUrl: {
    type: DataTypes.STRING,
  },
  metadata: {
    type: DataTypes.JSON,
  },
}, {
  timestamps: true,
});

Notification.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });

module.exports = Notification;