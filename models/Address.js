const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Address = sequelize.define("Address", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  addressLine: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  postalCode: { type: DataTypes.STRING },
}, { timestamps: true });

User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

module.exports = Address;
