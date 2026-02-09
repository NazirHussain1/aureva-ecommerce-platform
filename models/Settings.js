const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'support@aureva.com'
  },
  salesEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'sales@aureva.com'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '+1 (555) 123-4567'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '123 Beauty Avenue, New York, NY 10001'
  },
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  twitterUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  youtubeUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'settings',
  timestamps: true
});

module.exports = Settings;
