// Test setup and configuration

// Set test environment BEFORE importing any modules
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-12345';

const sequelize = require('../config/db');

// Import all models to ensure they're registered with Sequelize
const models = require('../models');

// Increase timeout for database operations
jest.setTimeout(30000);

// Setup before all tests
beforeAll(async () => {
  try {
    // Sync database models (creates tables in SQLite memory)
    await sequelize.sync({ force: true });
    console.log('✓ Test database initialized');
  } catch (error) {
    console.error('Database setup error:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Database cleanup error:', error);
  }
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
