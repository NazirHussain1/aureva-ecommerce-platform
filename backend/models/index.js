// Import all models to register them with Sequelize
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Address = require('./Address');
const Wishlist = require('./Wishlist');
const Review = require('./Review');
const Coupon = require('./Coupon');
const Notification = require('./Notification');
const Newsletter = require('./Newsletter');
const Payment = require('./Payment');
const Settings = require('./Settings');

module.exports = {
  User,
  Product,
  Cart,
  Order,
  OrderItem,
  Address,
  Wishlist,
  Review,
  Coupon,
  Notification,
  Newsletter,
  Payment,
  Settings
};
