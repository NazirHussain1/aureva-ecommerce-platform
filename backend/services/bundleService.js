const ProductBundle = require('../models/ProductBundle');
const BundleItem = require('../models/BundleItem');
const Product = require('../models/Product');
const { Op } = require('sequelize');

class BundleService {
  // Create product bundle
  static async createBundle(bundleData) {
    try {
      // Calculate original price from products
      let originalPrice = 0;
      for (const item of bundleData.items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        originalPrice += product.price * item.quantity;
      }

      // Calculate discount
      const discount = ((originalPrice - bundleData.bundlePrice) / originalPrice * 100).toFixed(2);

      // Create bundle
      const bundle = await ProductBundle.create({
        name: bundleData.name,
        description: bundleData.description,
        bundlePrice: bundleData.bundlePrice,
        originalPrice,
        discount,
        images: bundleData.images || [],
        stock: bundleData.stock || 0,
        category: bundleData.category,
        tags: bundleData.tags || [],
        validFrom: bundleData.validFrom,
        validUntil: bundleData.validUntil,
        isActive: bundleData.isActive !== false
      });

      // Add bundle items
      for (const item of bundleData.items) {
        await BundleItem.create({
          ProductBundleId: bundle.id,
          ProductId: item.productId,
          quantity: item.quantity,
          isOptional: item.isOptional || false
        });
      }

      return await this.getBundleById(bundle.id);
    } catch (error) {
      console.error('Error creating bundle:', error);
      throw error;
    }
  }

  // Get bundle by ID
  static async getBundleById(bundleId) {
    try {
      const bundle = await ProductBundle.findByPk(bundleId, {
        include: [
          {
            model: BundleItem,
            include: [
              {
                model: Product,
                attributes: ['id', 'name', 'price', 'images', 'stock', 'category']
              }
            ]
          }
        ]
      });

      return bundle;
    } catch (error) {
      console.error('Error getting bundle:', error);
      throw error;
    }
  }

  // Get all active bundles
  static async getActiveBundles(filters = {}) {
    try {
      const { category, page = 1, limit = 12 } = filters;
      
      let where = { isActive: true };
      
      // Check validity dates
      const now = new Date();
      where[Op.or] = [
        { validFrom: null, validUntil: null },
        { validFrom: { [Op.lte]: now }, validUntil: { [Op.gte]: now } },
        { validFrom: { [Op.lte]: now }, validUntil: null },
        { validFrom: null, validUntil: { [Op.gte]: now } }
      ];

      if (category) {
        where.category = category;
      }

      const offset = (page - 1) * limit;

      const { count, rows: bundles } = await ProductBundle.findAndCountAll({
        where,
        include: [
          {
            model: BundleItem,
            include: [
              {
                model: Product,
                attributes: ['id', 'name', 'price', 'images']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        bundles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalBundles: count
        }
      };
    } catch (error) {
      console.error('Error getting active bundles:', error);
      throw error;
    }
  }

  // Update bundle
  static async updateBundle(bundleId, updateData) {
    try {
      const bundle = await ProductBundle.findByPk(bundleId);
      
      if (!bundle) {
        throw new Error('Bundle not found');
      }

      // If items are being updated, recalculate prices
      if (updateData.items) {
        let originalPrice = 0;
        for (const item of updateData.items) {
          const product = await Product.findByPk(item.productId);
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }
          originalPrice += product.price * item.quantity;
        }

        updateData.originalPrice = originalPrice;
        updateData.discount = ((originalPrice - updateData.bundlePrice) / originalPrice * 100).toFixed(2);

        // Delete old bundle items
        await BundleItem.destroy({ where: { ProductBundleId: bundleId } });

        // Add new bundle items
        for (const item of updateData.items) {
          await BundleItem.create({
            ProductBundleId: bundleId,
            ProductId: item.productId,
            quantity: item.quantity,
            isOptional: item.isOptional || false
          });
        }

        delete updateData.items;
      }

      await bundle.update(updateData);

      return await this.getBundleById(bundleId);
    } catch (error) {
      console.error('Error updating bundle:', error);
      throw error;
    }
  }

  // Delete bundle
  static async deleteBundle(bundleId) {
    try {
      const bundle = await ProductBundle.findByPk(bundleId);
      
      if (!bundle) {
        throw new Error('Bundle not found');
      }

      // Delete bundle items first
      await BundleItem.destroy({ where: { ProductBundleId: bundleId } });

      // Delete bundle
      await bundle.destroy();

      return true;
    } catch (error) {
      console.error('Error deleting bundle:', error);
      throw error;
    }
  }

  // Check bundle stock availability
  static async checkBundleStock(bundleId, quantity = 1) {
    try {
      const bundle = await this.getBundleById(bundleId);
      
      if (!bundle) {
        throw new Error('Bundle not found');
      }

      if (bundle.stock < quantity) {
        return { available: false, message: 'Bundle out of stock' };
      }

      // Check individual product stock
      for (const bundleItem of bundle.BundleItems) {
        const requiredQuantity = bundleItem.quantity * quantity;
        if (bundleItem.Product.stock < requiredQuantity) {
          return {
            available: false,
            message: `${bundleItem.Product.name} has insufficient stock`
          };
        }
      }

      return { available: true };
    } catch (error) {
      console.error('Error checking bundle stock:', error);
      throw error;
    }
  }
}

module.exports = BundleService;