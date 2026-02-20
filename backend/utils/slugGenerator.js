/**
 * Enterprise-level Slug Generator Utility
 * Handles slug generation, uniqueness, and validation
 */

const Category = require('../modules/category/category.model');
const Product = require('../models/Product');

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - Generated slug
 */
const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Ensure slug uniqueness by appending number if needed
 * @param {string} baseSlug - Base slug to check
 * @param {string} modelName - Model name ('category' or 'product')
 * @param {number} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>} - Unique slug
 */
const ensureUniqueSlug = async (baseSlug, modelName = 'category', excludeId = null) => {
  const Model = modelName === 'category' ? Category : Product;
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const whereClause = { slug };
    if (excludeId) {
      whereClause.id = { [require('sequelize').Op.ne]: excludeId };
    }
    
    const existing = await Model.unscoped().findOne({ 
      where: whereClause,
      attributes: ['id']
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Generate unique slug for category
 * @param {string} name - Category name
 * @param {number} excludeId - ID to exclude (for updates)
 * @returns {Promise<string>} - Unique slug
 */
const generateCategorySlug = async (name, excludeId = null) => {
  const baseSlug = generateSlug(name);
  return ensureUniqueSlug(baseSlug, 'category', excludeId);
};

/**
 * Generate unique slug for product
 * @param {string} name - Product name
 * @param {number} excludeId - ID to exclude (for updates)
 * @returns {Promise<string>} - Unique slug
 */
const generateProductSlug = async (name, excludeId = null) => {
  const baseSlug = generateSlug(name);
  return ensureUniqueSlug(baseSlug, 'product', excludeId);
};

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} - Is valid
 */
const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Generate canonical URL for category
 * @param {string} slug - Category slug
 * @param {string} baseUrl - Base URL (from env)
 * @returns {string} - Canonical URL
 */
const generateCanonicalUrl = (slug, baseUrl = process.env.FRONTEND_URL) => {
  return `${baseUrl}/${slug}`;
};

module.exports = {
  generateSlug,
  ensureUniqueSlug,
  generateCategorySlug,
  generateProductSlug,
  isValidSlug,
  generateCanonicalUrl
};
