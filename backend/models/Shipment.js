const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./Order");

const Shipment = sequelize.define("Shipment", {
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  courierService: {
    type: DataTypes.ENUM("tcs", "leopards", "trax", "callcourier", "postex", "other"),
    allowNull: false,
  },
  courierName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Custom courier name if 'other' is selected"
  },
  status: {
    type: DataTypes.ENUM("pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "returned"),
    defaultValue: "pending",
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currentLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  trackingUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "URL to courier's tracking page"
  },
}, { 
  timestamps: true 
});

// Associations
Shipment.belongsTo(Order);
Order.hasOne(Shipment);

module.exports = Shipment;