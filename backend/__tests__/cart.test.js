const request = require('supertest');
const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

// Create Express app for testing
const app = express();
app.use(express.json());

// Import routes
const cartRoutes = require('../routes/cartRoutes');
app.use('/api/cart', protect, cartRoutes);

describe('Cart Controller Tests', () => {
  let userToken;
  let testUser;
  let testProduct;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Cart Test User',
      email: 'cartuser@test.com',
      password: 'Password123!',
      role: 'customer'
    });

    userToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create test product
    testProduct = await Product.create({
      name: 'Cart Test Product',
      description: 'Test product for cart',
      price: 29.99,
      stock: 100,
      category: 'Test',
      brand: 'Test Brand',
      images: ['test.jpg']
    });
  });

  describe('GET /api/cart', () => {
    
    it('should get empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should get cart items with products', async () => {
      // Add item to cart
      await Cart.create({
        userId: testUser.id,
        productId: testProduct.id,
        quantity: 2
      });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('Product');
      expect(response.body[0].quantity).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Cart, 'findAll').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('POST /api/cart', () => {
    
    it('should add new item to cart', async () => {
      const newProduct = await Product.create({
        name: 'New Cart Product',
        description: 'New product',
        price: 19.99,
        stock: 50,
        category: 'Test',
        brand: 'Test',
        images: ['new.jpg']
      });

      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: newProduct.id,
          quantity: 3
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.productId).toBe(newProduct.id);
      expect(response.body.quantity).toBe(3);
      expect(response.body.userId).toBe(testUser.id);
    });

    it('should update quantity if item already exists in cart', async () => {
      const product = await Product.create({
        name: 'Existing Cart Product',
        description: 'Existing',
        price: 39.99,
        stock: 30,
        category: 'Test',
        brand: 'Test',
        images: ['exist.jpg']
      });

      // Add item first time
      await Cart.create({
        userId: testUser.id,
        productId: product.id,
        quantity: 2
      });

      // Add same item again
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product.id,
          quantity: 3
        })
        .expect(200);

      expect(response.body.quantity).toBe(5); // 2 + 3
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: testProduct.id,
          quantity: 1
        })
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Cart, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct.id,
          quantity: 1
        })
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('PUT /api/cart/:id', () => {
    
    it('should update cart item quantity', async () => {
      const cartItem = await Cart.create({
        userId: testUser.id,
        productId: testProduct.id,
        quantity: 5
      });

      const response = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(200);

      expect(response.body.quantity).toBe(10);
    });

    it('should return 404 for non-existent cart item', async () => {
      const response = await request(app)
        .put('/api/cart/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(404);

      expect(response.body.message).toBe('Cart item not found');
    });

    it('should return 404 if cart item belongs to different user', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@test.com',
        password: 'Password123!',
        role: 'customer'
      });

      const otherCartItem = await Cart.create({
        userId: otherUser.id,
        productId: testProduct.id,
        quantity: 3
      });

      const response = await request(app)
        .put(`/api/cart/${otherCartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(404);

      expect(response.body.message).toBe('Cart item not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/cart/1')
        .send({ quantity: 5 })
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Cart, 'findByPk').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .put('/api/cart/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('DELETE /api/cart/:id', () => {
    
    it('should remove cart item', async () => {
      const cartItem = await Cart.create({
        userId: testUser.id,
        productId: testProduct.id,
        quantity: 2
      });

      const response = await request(app)
        .delete(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.message).toBe('Cart item removed');

      // Verify item is deleted
      const deletedItem = await Cart.findByPk(cartItem.id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 for non-existent cart item', async () => {
      const response = await request(app)
        .delete('/api/cart/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.message).toBe('Cart item not found');
    });

    it('should return 404 if cart item belongs to different user', async () => {
      const otherUser = await User.create({
        name: 'Another User',
        email: 'another@test.com',
        password: 'Password123!',
        role: 'customer'
      });

      const otherCartItem = await Cart.create({
        userId: otherUser.id,
        productId: testProduct.id,
        quantity: 1
      });

      const response = await request(app)
        .delete(`/api/cart/${otherCartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.message).toBe('Cart item not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/cart/1')
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Cart, 'findByPk').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .delete('/api/cart/1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });
});
