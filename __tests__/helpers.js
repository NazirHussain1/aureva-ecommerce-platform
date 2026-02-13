const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * Generate JWT token for testing
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateTestToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Create test user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user and token
 */
const createTestUser = async (userData = {}) => {
  const defaultData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: await bcrypt.hash('Password123!', 10),
    role: 'customer'
  };

  const user = await User.create({ ...defaultData, ...userData });
  const token = generateTestToken(user);

  return { user, token };
};

/**
 * Create test admin user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created admin user and token
 */
const createTestAdmin = async (userData = {}) => {
  return createTestUser({ ...userData, role: 'admin' });
};

/**
 * Create test product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
const createTestProduct = async (productData = {}) => {
  const defaultData = {
    name: `Test Product ${Date.now()}`,
    description: 'Test product description',
    price: 29.99,
    stock: 100,
    category: 'Test Category',
    brand: 'Test Brand',
    images: ['test-image.jpg']
  };

  return await Product.create({ ...defaultData, ...productData });
};

/**
 * Create multiple test products
 * @param {Number} count - Number of products to create
 * @param {Object} baseData - Base product data
 * @returns {Promise<Array>} Array of created products
 */
const createTestProducts = async (count = 5, baseData = {}) => {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const product = await createTestProduct({
      ...baseData,
      name: `Test Product ${i + 1}`,
      price: 10 + (i * 5)
    });
    products.push(product);
  }

  return products;
};

/**
 * Clean up test data
 * @param {Array} models - Array of Sequelize models to clean
 */
const cleanupTestData = async (...models) => {
  for (const model of models) {
    await model.destroy({ where: {}, truncate: true });
  }
};

/**
 * Mock email service
 */
const mockEmailService = () => {
  jest.mock('../services/emailService', () => ({
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    sendOrderConfirmationEmail: jest.fn().mockResolvedValue(true)
  }));
};

/**
 * Mock notification service
 */
const mockNotificationService = () => {
  jest.mock('../services/notificationService', () => ({
    createLowStockAlert: jest.fn().mockResolvedValue(true),
    createOrderNotification: jest.fn().mockResolvedValue(true),
    sendNotification: jest.fn().mockResolvedValue(true)
  }));
};

/**
 * Wait for async operations
 * @param {Number} ms - Milliseconds to wait
 */
const wait = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate random email
 * @returns {String} Random email address
 */
const randomEmail = () => `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;

/**
 * Generate random string
 * @param {Number} length - Length of string
 * @returns {String} Random string
 */
const randomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Assert response structure
 * @param {Object} response - Supertest response
 * @param {Number} status - Expected status code
 * @param {Array} properties - Expected properties in response body
 */
const assertResponse = (response, status, properties = []) => {
  expect(response.status).toBe(status);
  properties.forEach(prop => {
    expect(response.body).toHaveProperty(prop);
  });
};

/**
 * Assert error response
 * @param {Object} response - Supertest response
 * @param {Number} status - Expected status code
 * @param {String} message - Expected error message
 */
const assertError = (response, status, message) => {
  expect(response.status).toBe(status);
  expect(response.body).toHaveProperty('message');
  if (message) {
    expect(response.body.message).toBe(message);
  }
};

/**
 * Create test request with auth
 * @param {Object} app - Express app
 * @param {String} method - HTTP method
 * @param {String} url - Request URL
 * @param {String} token - Auth token
 * @returns {Object} Supertest request
 */
const authenticatedRequest = (app, method, url, token) => {
  const request = require('supertest');
  return request(app)[method.toLowerCase()](url)
    .set('Authorization', `Bearer ${token}`);
};

module.exports = {
  generateTestToken,
  createTestUser,
  createTestAdmin,
  createTestProduct,
  createTestProducts,
  cleanupTestData,
  mockEmailService,
  mockNotificationService,
  wait,
  randomEmail,
  randomString,
  assertResponse,
  assertError,
  authenticatedRequest
};
