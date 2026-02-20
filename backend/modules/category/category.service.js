const { Op } = require('sequelize');
const Category = require('./category.model');
const Product = require('../../models/Product');
const { generateCategorySlug, generateCanonicalUrl } = require('../../utils/slugGenerator');

/**
 * Enterprise Category Service
 * Handles all business logic for category operations
 */

class CategoryService {
  /**
   * Create a new category
   */
  async createCategory(data) {
    const { name, parentId, level, ...rest } = data;
    
    // Validate parent category if provided
    if (parentId) {
      const parent = await Category.findByPk(parentId);
      if (!parent) {
        throw new Error('Parent category not found');
      }
      
      // Validate level hierarchy
      if (parent.level >= 2) {
        throw new Error('Cannot create sub-category under a level 2 category');
      }
      
      // Auto-set level based on parent
      data.level = parent.level + 1;
    } else {
      data.level = 0; // Root level
    }
    
    // Generate unique slug
    data.slug = await generateCategorySlug(name);
    
    // Generate canonical URL
    data.canonicalUrl = generateCanonicalUrl(data.slug);
    
    // Auto-generate meta fields if not provided
    if (!data.metaTitle) {
      data.metaTitle = name;
    }
    
    const category = await Category.create(data);
    return category;
  }
  
  /**
   * Update category
   */
  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // If name changed, regenerate slug
    if (data.name && data.name !== category.name) {
      data.slug = await generateCategorySlug(data.name, id);
      data.canonicalUrl = generateCanonicalUrl(data.slug);
    }
    
    // Validate parent change
    if (data.parentId !== undefined && data.parentId !== category.parentId) {
      if (data.parentId === id) {
        throw new Error('Category cannot be its own parent');
      }
      
      if (data.parentId) {
        const parent = await Category.findByPk(data.parentId);
        if (!parent) {
          throw new Error('Parent category not found');
        }
        
        // Check if new parent is a descendant
        const isDescendant = await this.isDescendant(id, data.parentId);
        if (isDescendant) {
          throw new Error('Cannot set a descendant as parent');
        }
        
        data.level = parent.level + 1;
      } else {
        data.level = 0;
      }
    }
    
    await category.update(data);
    return category;
  }
  
  /**
   * Soft delete category
   */
  async deleteCategory(id, force = false) {
    const category = await Category.unscoped().findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Check if category has products
    const productCount = await Product.count({ where: { categoryId: id } });
    if (productCount > 0 && !force) {
      throw new Error(
        `Cannot delete category with ${productCount} products. ` +
        'Please reassign products first or use force delete.'
      );
    }
    
    // Check if category has children
    const childCount = await Category.count({ where: { parentId: id } });
    if (childCount > 0) {
      throw new Error(
        `Cannot delete category with ${childCount} sub-categories. ` +
        'Please delete or reassign sub-categories first.'
      );
    }
    
    // Soft delete
    await category.update({
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false
    });
    
    return { message: 'Category deleted successfully' };
  }
  
  /**
   * Get category tree (hierarchical structure)
   */
  async getCategoryTree(includeInactive = false) {
    const whereClause = { parentId: null };
    if (!includeInactive) {
      whereClause.isActive = true;
    }
    
    const categories = await Category.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'children',
          where: includeInactive ? {} : { isActive: true },
          required: false,
          include: [
            {
              model: Category,
              as: 'children',
              where: includeInactive ? {} : { isActive: true },
              required: false
            }
          ]
        }
      ],
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
        [{ model: Category, as: 'children' }, 'displayOrder', 'ASC'],
        [{ model: Category, as: 'children' }, 'name', 'ASC'],
        [{ model: Category, as: 'children' }, { model: Category, as: 'children' }, 'displayOrder', 'ASC']
      ]
    });
    
    return categories;
  }
  
  /**
   * Get single category by slug with breadcrumbs
   */
  async getCategoryBySlug(slug) {
    const category = await Category.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false
        }
      ]
    });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Get breadcrumbs
    const breadcrumbs = await this.getBreadcrumbs(category.id);
    
    return {
      ...category.toJSON(),
      breadcrumbs
    };
  }
  
  /**
   * Get breadcrumbs for a category
   */
  async getBreadcrumbs(categoryId) {
    const breadcrumbs = [];
    let currentId = categoryId;
    
    while (currentId) {
      const category = await Category.findByPk(currentId, {
        attributes: ['id', 'name', 'slug', 'parentId']
      });
      
      if (!category) break;
      
      breadcrumbs.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug,
        url: `/${category.slug}`
      });
      
      currentId = category.parentId;
    }
    
    return breadcrumbs;
  }
  
  /**
   * Get products by category with filters
   */
  async getProductsByCategory(slug, filters = {}) {
    const {
      gender,
      minPrice,
      maxPrice,
      brand,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;
    
    // Find category
    const category = await Category.findOne({ where: { slug } });
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Get all descendant category IDs
    const categoryIds = await this.getDescendantIds(category.id);
    categoryIds.push(category.id);
    
    // Build product query
    const whereClause = {
      categoryId: { [Op.in]: categoryIds },
      isActive: true,
      isDeleted: false
    };
    
    if (gender) {
      whereClause.gender = gender;
    }
    
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }
    
    if (brand) {
      whereClause.brand = { [Op.like]: `%${brand}%` };
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder]],
      attributes: { exclude: ['isDeleted'] }
    });
    
    // Get breadcrumbs
    const breadcrumbs = await this.getBreadcrumbs(category.id);
    
    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        breadcrumbs
      },
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }
  
  /**
   * Get all descendant category IDs
   */
  async getDescendantIds(categoryId) {
    const descendants = [];
    
    const children = await Category.findAll({
      where: { parentId: categoryId },
      attributes: ['id']
    });
    
    for (const child of children) {
      descendants.push(child.id);
      const childDescendants = await this.getDescendantIds(child.id);
      descendants.push(...childDescendants);
    }
    
    return descendants;
  }
  
  /**
   * Check if category is a descendant of another
   */
  async isDescendant(ancestorId, descendantId) {
    let currentId = descendantId;
    
    while (currentId) {
      if (currentId === ancestorId) {
        return true;
      }
      
      const category = await Category.findByPk(currentId, {
        attributes: ['parentId']
      });
      
      if (!category) break;
      currentId = category.parentId;
    }
    
    return false;
  }
  
  /**
   * Reassign products to new category
   */
  async reassignProducts(fromCategoryId, toCategoryId) {
    const toCategory = await Category.findByPk(toCategoryId);
    if (!toCategory) {
      throw new Error('Target category not found');
    }
    
    const updated = await Product.update(
      { categoryId: toCategoryId },
      { where: { categoryId: fromCategoryId } }
    );
    
    return { reassignedCount: updated[0] };
  }
}

module.exports = new CategoryService();
