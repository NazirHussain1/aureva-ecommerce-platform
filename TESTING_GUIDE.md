# Backend API Testing Guide

## Overview

This project uses **Jest** and **Supertest** for comprehensive API testing. The test suite covers authentication, products, cart, and order management with success cases, validation errors, and failure scenarios.

## 📦 Installation

```bash
cd backend
npm install --save-dev jest supertest @types/jest @types/supertest
```

## 🚀 Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test auth.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should successfully login"
```

### Advanced Options
```bash
# Verbose output
npm test -- --verbose

# Show all console logs
npm test -- --silent=false

# Detect open handles (for debugging hanging tests)
npm test -- --detectOpenHandles

# Run tests in specific order
npm test -- --runInBand
```

## 📁 Test Structure

```
backend/
├── __tests__/
│   ├── setup.js              # Test configuration & database setup
│   ├── helpers.js            # Reusable test utilities
│   ├── auth.test.js          # Authentication tests
│   ├── product.test.js       # Product management tests
│   ├── cart.test.js          # Shopping cart tests
│   ├── order.test.js         # Order management tests
│   ├── README.md             # Detailed testing documentation
│   └── QUICK_START.md        # Quick reference guide
├── package.json              # Jest configuration
└── TESTING_GUIDE.md          # This file
```

## 🧪 Test Coverage

### Current Test Files

#### 1. **auth.test.js** - Authentication Tests
- ✅ User signup (success, duplicate email, server error)
- ✅ User login (valid/invalid credentials)
- ✅ Password reset flow (request, validation, expiry)
- ✅ Token generation and validation
- ✅ Get current user profile

#### 2. **product.test.js** - Product Tests
- ✅ Get all products with filters (category, brand, price)
- ✅ Search products with pagination
- ✅ Get product by ID/slug
- ✅ Get categories and brands
- ✅ Product suggestions for autocomplete
- ✅ Sorting and filtering

#### 3. **cart.test.js** - Cart Tests
- ✅ Get cart items
- ✅ Add to cart (new item, update existing)
- ✅ Update cart item quantity
- ✅ Remove cart item
- ✅ Authorization checks

#### 4. **order.test.js** - Order Tests
- ✅ Create order with validation
- ✅ Get user orders
- ✅ Get order by ID
- ✅ Cancel order
- ✅ Stock validation
- ✅ Authorization checks

## 🛠️ Helper Functions

The `helpers.js` file provides utilities for common testing tasks:

```javascript
const {
  createTestUser,        // Create test user with token
  createTestAdmin,       // Create admin user with token
  createTestProduct,     // Create test product
  createTestProducts,    // Create multiple products
  generateTestToken,     // Generate JWT token
  assertResponse,        // Assert response structure
  assertError,           // Assert error response
  cleanupTestData,       // Clean up test data
  randomEmail,           // Generate random email
  randomString           // Generate random string
} = require('./__tests__/helpers');
```

### Usage Examples

```javascript
// Create test user
const { user, token } = await createTestUser({
  name: 'John Doe',
  email: 'john@example.com'
});

// Create test product
const product = await createTestProduct({
  name: 'Test Product',
  price: 29.99,
  stock: 100
});

// Assert response
assertResponse(response, 200, ['id', 'name', 'email']);

// Assert error
assertError(response, 400, 'Validation failed');
```

## 📝 Writing New Tests

### Basic Test Template

```javascript
const request = require('supertest');
const express = require('express');
const Model = require('../models/Model');
const { createTestUser } = require('./helpers');

const app = express();
app.use(express.json());

// Import routes
const routes = require('../routes/yourRoutes');
app.use('/api/endpoint', routes);

describe('Controller Name Tests', () => {
  
  describe('GET /api/endpoint', () => {
    
    it('should test success case', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .expect(200);
      
      expect(response.body).toHaveProperty('data');
    });

    it('should test validation error', async () => {
      const response = await request(app)
        .post('/api/endpoint')
        .send({ invalid: 'data' })
        .expect(400);
      
      expect(response.body.message).toBeDefined();
    });

    it('should test server error', async () => {
      jest.spyOn(Model, 'findAll')
        .mockRejectedValueOnce(new Error('DB error'));
      
      const response = await request(app)
        .get('/api/endpoint')
        .expect(500);
      
      expect(response.body.message).toBe('Server error');
    });
  });
});
```

### Testing Protected Routes

```javascript
it('should access protected route with valid token', async () => {
  const { user, token } = await createTestUser();
  
  const response = await request(app)
    .get('/api/protected')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  
  expect(response.body.userId).toBe(user.id);
});
```

### Mocking External Services

```javascript
// Mock email service
jest.mock('../services/emailService', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
}));

// Mock database methods
jest.spyOn(User, 'findOne')
  .mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

jest.spyOn(Product, 'create')
  .mockRejectedValueOnce(new Error('Database error'));
```

## ✅ Testing Checklist

For each API endpoint, ensure you test:

- ✅ **Success case** (200/201) - Happy path with valid data
- ✅ **Validation errors** (400) - Missing/invalid fields
- ✅ **Authentication** (401) - Missing/invalid token
- ✅ **Authorization** (403) - Insufficient permissions
- ✅ **Not found** (404) - Non-existent resources
- ✅ **Server errors** (500) - Database/service failures
- ✅ **Edge cases** - Boundary conditions, race conditions

## 📊 Coverage Goals

Target coverage metrics:
- **Line Coverage**: 80%+
- **Branch Coverage**: 70%+
- **Function Coverage**: 80%+
- **Statement Coverage**: 80%+

Check coverage:
```bash
npm run test:coverage
```

## 🐛 Debugging Tests

### Common Issues & Solutions

#### Tests Hanging
```javascript
// Increase timeout
jest.setTimeout(30000);

// Close database connections
afterAll(async () => {
  await sequelize.close();
});
```

#### Mocks Not Working
```javascript
// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

// Reset modules
beforeEach(() => {
  jest.resetModules();
});
```

#### Database Conflicts
```javascript
// Use unique data
const email = `test${Date.now()}@example.com`;

// Clean up after tests
afterEach(async () => {
  await User.destroy({ where: {} });
});
```

#### Async Issues
```javascript
// Always use async/await
it('should work', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});

// Don't forget to await
await request(app).get('/api/endpoint');
```

## 🎯 Best Practices

1. **Use descriptive test names**
   ```javascript
   ✅ it('should return 401 when authentication token is missing')
   ❌ it('test auth')
   ```

2. **Test one thing per test**
   ```javascript
   ✅ it('should create user')
   ✅ it('should return error for duplicate email')
   ❌ it('should create user and handle errors')
   ```

3. **Arrange-Act-Assert pattern**
   ```javascript
   it('should update user', async () => {
     // Arrange
     const user = await createTestUser();
     
     // Act
     const response = await request(app)
       .put(`/api/users/${user.id}`)
       .send({ name: 'New Name' });
     
     // Assert
     expect(response.status).toBe(200);
     expect(response.body.name).toBe('New Name');
   });
   ```

4. **Mock external dependencies**
   - Don't send real emails
   - Don't charge real payments
   - Don't call external APIs

5. **Keep tests independent**
   - Each test should run in isolation
   - Don't rely on test execution order
   - Clean up after each test

6. **Use beforeEach/afterEach wisely**
   ```javascript
   beforeEach(async () => {
     // Set up test data
   });
   
   afterEach(async () => {
     // Clean up
     jest.clearAllMocks();
   });
   ```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
- [Node.js Testing Guide](https://nodejs.org/en/docs/guides/testing/)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage above 80%
4. Update this documentation

## 📞 Support

For questions or issues:
- Check existing test files for examples
- Review `__tests__/README.md` for detailed docs
- See `__tests__/QUICK_START.md` for quick reference

---

**Happy Testing! 🎉**
