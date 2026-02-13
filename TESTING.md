# Backend API Testing Guide

## Overview

This project has Jest and Supertest configured for API testing. The test infrastructure is set up with 70+ test cases covering authentication, products, cart, and orders.

## Current Status

⚠️ **Tests require database configuration to run**

The test files are complete and ready, but need one of the following database setups:

### Option 1: Use MySQL Test Database (Recommended)
```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE aureva_test;"

# Update .env with test database
DB_NAME=aureva_test
```

### Option 2: Mock Database Calls
Mock Sequelize operations in tests for unit testing without database dependency.

## Test Files

```
backend/
├── __tests__/
│   ├── setup.js          # Test configuration
│   ├── helpers.js        # Test utilities  
│   ├── auth.test.js      # 13 authentication tests
│   ├── product.test.js   # 22 product tests
│   ├── cart.test.js      # 17 cart tests
│   └── order.test.js     # 17 order tests
├── models/
│   └── index.js          # Model exports
└── TESTING.md            # This file
```

## Commands

```bash
# Run all tests (once database is configured)
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test auth.test.js
```

## Helper Functions

```javascript
const {
  createTestUser,        // Create test user with token
  createTestAdmin,       // Create admin user
  createTestProduct,     // Create test product
  generateTestToken,     // Generate JWT token
  assertResponse,        // Assert response structure
  assertError           // Assert error response
} = require('./__tests__/helpers');
```

## What's Included

✅ Jest & Supertest installed and configured  
✅ 70+ comprehensive test cases written  
✅ Test utilities and helpers  
✅ SQLite configured for in-memory testing  
✅ Cross-platform environment variable support  
✅ Coverage reporting configured  

## Next Steps

1. Choose a database approach (MySQL test DB or mocking)
2. Configure the chosen approach
3. Run `npm test` to execute all tests
4. Achieve 80%+ code coverage

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- Test files in `__tests__/` directory for examples

