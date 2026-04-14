const Category = require('../modules/category/category.model');
const Product = require('./Product');

// Define relationships
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'RESTRICT'
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'categoryDetails'
});

module.exports = {
  Category,
  Product
};
