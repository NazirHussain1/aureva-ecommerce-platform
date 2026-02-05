const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Shipment = require("./Shipment");

const ShipmentTracking = sequelize.define("ShipmentTracking", {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { 
  timestamps: true 
});

// Associations
ShipmentTracking.belongsTo(Shipment);
Shipment.hasMany(ShipmentTracking);

module.exports = ShipmentTracking;