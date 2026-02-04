const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Order = sequelize.define("Order", {
  items: { type: DataTypes.JSON, allowNull: false }, // array of {productId, quantity, price}
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "processing", "shipped", "delivered"),
    defaultValue: "pending",
  },
  shippingAddress: { type: DataTypes.JSON, allowNull: false }, // {name, phone, addressLine1, city, postalCode}
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
});

// Association
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;
