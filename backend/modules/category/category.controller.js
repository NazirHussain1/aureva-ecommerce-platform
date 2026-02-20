const { validationResult } = require('express-validator');
const categoryService = require('./category.service');

/**
 * Enterprise Category Controller
 * Handles HTTP requests and responses
 */

class CategoryController {
  /**
   * @route   POST /api/categories
   * @desc    Create new category
   * @access  Admin
   */
  async createCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }
      
      const category = await categoryService.createCategory(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create category'
      });
    }
  }
  
  /**
   * @route   PUT /api/categories/:id
   * @desc    Update category
   * @access  Admin
   */
  async updateCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }
      
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update category'
      });
    }
  }
  
  /**
   * @route   DELETE /api/categories/:id
   * @desc    Soft delete category
   * @access  Admin
   */
  async deleteCategory(req, res) {
    try {
      const { force } = req.query;
      
      const result = await categoryService.deleteCategory(
        req.params.id,
        force === 'true'
      );
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete category'
      });
    }
  }
  
  /**
   * @route   GET /api/categories/tree
   * @desc    Get category tree (hierarchical)
   * @access  Public
   */
  async getCategoryTree(req, res) {
    try {
      const { includeInactive } = req.query;
      
      const tree = await categoryService.getCategoryTree(
        includeInactive === 'true'
      );
      
      res.json({
        success: true,
        data: tree
      });
    } catch (error) {
      console.error('Get category tree error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category tree'
      });
    }
  }
  
  /**
   * @route   GET /api/categories/:slug
   * @desc    Get single category by slug
   * @access  Public
   */
  async getCategoryBySlug(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }
      
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Category not found'
      });
    }
  }
  
  /**
   * @route   GET /api/categories/:slug/products
   * @desc    Get products by category with filters
   * @access  Public
   */
  async getProductsByCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }
      
      const result = await categoryService.getProductsByCategory(
        req.params.slug,
        req.query
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get products by category error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to fetch products'
      });
    }
  }
  
  /**
   * @route   POST /api/categories/:id/reassign
   * @desc    Reassign products to another category
   * @access  Admin
   */
  async reassignProducts(req, res) {
    try {
      const { toCategoryId } = req.body;
      
      if (!toCategoryId) {
        return res.status(400).json({
          success: false,
          message: 'Target category ID is required'
        });
      }
      
      const result = await categoryService.reassignProducts(
        req.params.id,
        toCategoryId
      );
      
      res.json({
        success: true,
        message: 'Products reassigned successfully',
        data: result
      });
    } catch (error) {
      console.error('Reassign products error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reassign products'
      });
    }
  }
}

module.exports = new CategoryController();
