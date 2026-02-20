const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Category name is required' },
      len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' }
    }
  },
  slug: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isLowercase: true,
      is: /^[a-z0-9-]+$/
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Icon identifier for UI (e.g., FaSprayCan, GiLipstick)'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // Hierarchy
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 2
    },
    comment: '0=Parent, 1=Child, 2=Sub-child'
  },
  
  // SEO Fields
  metaTitle: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  metaKeywords: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  canonicalUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // Display & Ordering
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Soft Delete
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true,
  indexes: [
    { fields: ['slug'], unique: true },
    { fields: ['parentId'] }
  ],
  defaultScope: {
    where: { isDeleted: false }
  },
  scopes: {
    active: { where: { isActive: true, isDeleted: false } },
    deleted: { where: { isDeleted: true } },
    withDeleted: { where: {} }
  }
});

// Self-referential association
Category.hasMany(Category, { 
  as: 'children', 
  foreignKey: 'parentId',
  onDelete: 'RESTRICT'
});

Category.belongsTo(Category, { 
  as: 'parent', 
  foreignKey: 'parentId' 
});

module.exports = Category;
