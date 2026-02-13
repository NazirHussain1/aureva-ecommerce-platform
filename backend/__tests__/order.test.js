const request = require('supertest');
const express = require('express');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const {
  createTestUser,
  createTestProduct,
  generateTestToken,
  assertResponse,
  assertError,
  cleanupTestData
} = require('./helpers');

// Create Express app for testing
const app = express();
app.use(express.json());

// Import middleware and routes
const { protect } = require('../middleware/authMiddleware');
const orderRoutes = require('../routes/orderRoutes');
app.use('/api/orders', protect, orderRoutes);

// Mock services
jest.mock('../services/emailService', () => ({
  sendOrderConfirmationEmail: jest.fn().mockResolvedValue(true)
}));

jest.mock('../services/notificationService', () => ({
  createOrderNotification: jest.fn().mockResolvedValue(true)
}));

describe('Order Controller Tests', () => {
  let testUser;
  let userToken;
  let testProduct;

  beforeAll(async () => {
    // Create test user and product
    const userData = await createTestUser();
    testUser = userData.user;
    userToken = userData.token;

    testProduct = await createTestProduct({
      name: 'Order Test Product',
      price: 49.99,
      stock: 50
    });
  });

  afterAll(async () => {
    await cleanupTestData(Order, OrderItem, Product, require('../models/User'));
  });

  describe('POST /api/orders', () => {
    
    it('should create new order successfully', async () => {
      const orderData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 2,
            price: testProduct.price
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        totalAmount: testProduct.price * 2
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      assertResponse(response, 201, ['id', 'orderStatus', 'totalAmount', 'userId']);
      expect(response.body.totalAmount).toBe(orderData.totalAmount);
      expect(response.body.userId).toBe(testUser.id);
      expect(response.body.orderStatus).toBe('placed');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      assertError(response, 400);
    });

    it('should return 400 for invalid product', async () => {
      const orderData = {
        items: [
          {
            productId: 99999, // Non-existent product
            quantity: 1,
            price: 10
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        totalAmount: 10
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(400);

      assertError(response, 400);
    });

    it('should return 400 for insufficient stock', async () => {
      const lowStockProduct = await createTestProduct({
        name: 'Low Stock Product',
        price: 29.99,
        stock: 1
      });

      const orderData = {
        items: [
          {
            productId: lowStockProduct.id,
            quantity: 10, // More than available
            price: lowStockProduct.price
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        totalAmount: lowStockProduct.price * 10
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(400);

      assertError(response, 400);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({})
        .expect(401);

      assertError(response, 401, 'Not authorized, no token');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Order, 'create').mockRejectedValueOnce(new Error('Database error'));

      const orderData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            price: testProduct.price
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        totalAmount: testProduct.price
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(500);

      assertError(response, 500, 'Server error');
    });
  });

  describe('GET /api/orders', () => {
    
    it('should get all orders for authenticated user', async () => {
      // Create test order
      const order = await Order.create({
        userId: testUser.id,
        totalAmount: 99.99,
        orderStatus: 'placed',
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        }
      });

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('orderStatus');
    });

    it('should return empty array for user with no orders', async () => {
      const newUser = await createTestUser();

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${newUser.token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(401);

      assertError(response, 401, 'Not authorized, no token');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Order, 'findAll').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(500);

      assertError(response, 500, 'Server error');
    });
  });

  describe('GET /api/orders/:id', () => {
    
    it('should get order by ID', async () => {
      const order = await Order.create({
        userId: testUser.id,
        totalAmount: 149.99,
        orderStatus: 'processing',
        paymentMethod: 'paypal',
        shippingAddress: {
          street: '456 Test Ave',
          city: 'Test City',
          state: 'TS',
          zipCode: '54321',
          country: 'Test Country'
        }
      });

      const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.id).toBe(order.id);
      expect(response.body.totalAmount).toBe(149.99);
      expect(response.body.orderStatus).toBe('processing');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      assertError(response, 404, 'Order not found');
    });

    it('should return 403 for order belonging to different user', async () => {
      const otherUser = await createTestUser();
      
      const order = await Order.create({
        userId: otherUser.user.id,
        totalAmount: 79.99,
        orderStatus: 'placed',
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '789 Test Blvd',
          city: 'Test City',
          state: 'TS',
          zipCode: '67890',
          country: 'Test Country'
        }
      });

      const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      assertError(response, 403);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/orders/1')
        .expect(401);

      assertError(response, 401, 'Not authorized, no token');
    });
  });

  describe('PUT /api/orders/:id/cancel', () => {
    
    it('should cancel order successfully', async () => {
      const order = await Order.create({
        userId: testUser.id,
        totalAmount: 59.99,
        orderStatus: 'placed',
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '321 Test Ln',
          city: 'Test City',
          state: 'TS',
          zipCode: '13579',
          country: 'Test Country'
        }
      });

      const response = await request(app)
        .put(`/api/orders/${order.id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.orderStatus).toBe('cancelled');
      expect(response.body.message).toContain('cancelled');
    });

    it('should return 400 for already shipped order', async () => {
      const order = await Order.create({
        userId: testUser.id,
        totalAmount: 89.99,
        orderStatus: 'shipped',
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '654 Test Dr',
          city: 'Test City',
          state: 'TS',
          zipCode: '24680',
          country: 'Test Country'
        }
      });

      const response = await request(app)
        .put(`/api/orders/${order.id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      assertError(response, 400);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .put('/api/orders/99999/cancel')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      assertError(response, 404, 'Order not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/orders/1/cancel')
        .expect(401);

      assertError(response, 401, 'Not authorized, no token');
    });
  });
});
