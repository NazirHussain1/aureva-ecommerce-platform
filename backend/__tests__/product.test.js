const request = require('supertest');
const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());

// Import routes
const productRoutes = require('../routes/productRoutes');
app.use('/api/products', productRoutes);

// Mock notification service
jest.mock('../services/notificationService', () => ({
  createLowStockAlert: jest.fn().mockResolvedValue(true)
}));

describe('Product Controller Tests', () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    await Product.destroy({ where: {}, truncate: true });
  });

  beforeAll(async () => {
    // Create admin user for protected routes
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'AdminPass123!',
      role: 'admin'
    });

    adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  describe('GET /api/products', () => {
    
    beforeEach(async () => {
      // Create test products
      await Product.bulkCreate([
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 29.99,
          stock: 10,
          category: 'Electronics',
          brand: 'Brand A',
          images: ['image1.jpg']
        },
        {
          name: 'Product 2',
          description: 'Description 2',
          price: 49.99,
          stock: 5,
          category: 'Clothing',
          brand: 'Brand B',
          images: ['image2.jpg']
        },
        {
          name: 'Product 3',
          description: 'Description 3',
          price: 19.99,
          stock: 0,
          category: 'Electronics',
          brand: 'Brand A',
          images: ['image3.jpg']
        }
      ]);
    });

    it('should get all products with stock > 0', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.products.length).toBe(2); // Only products with stock
      expect(response.body.pagination.totalProducts).toBe(2);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].category).toBe('Electronics');
    });

    it('should filter products by brand', async () => {
      const response = await request(app)
        .get('/api/products?brand=Brand A')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].brand).toBe('Brand A');
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=20&maxPrice=40')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].price).toBeGreaterThanOrEqual(20);
      expect(response.body.products[0].price).toBeLessThanOrEqual(40);
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products?search=Product 1')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
      expect(response.body.products[0].name).toContain('Product 1');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=1')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.hasNextPage).toBe(true);
    });

    it('should sort products by price ascending', async () => {
      const response = await request(app)
        .get('/api/products?sortBy=price&sortOrder=ASC')
        .expect(200);

      const prices = response.body.products.map(p => p.price);
      expect(prices[0]).toBeLessThanOrEqual(prices[1]);
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Product, 'findAndCountAll').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('GET /api/products/:id', () => {
    
    it('should get product by ID', async () => {
      const product = await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 20,
        category: 'Test',
        brand: 'Test Brand',
        images: ['test.jpg']
      });

      const response = await request(app)
        .get(`/api/products/${product.id}`)
        .expect(200);

      expect(response.body.name).toBe('Test Product');
      expect(response.body.price).toBe(99.99);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/99999')
        .expect(404);

      expect(response.body.message).toBe('Product not found');
    });

    it('should get product by slug', async () => {
      const product = await Product.create({
        name: 'Slug Test Product',
        slug: 'slug-test-product',
        description: 'Test Description',
        price: 99.99,
        stock: 20,
        category: 'Test',
        brand: 'Test Brand',
        images: ['test.jpg']
      });

      const response = await request(app)
        .get(`/api/products/${product.slug}`)
        .expect(200);

      expect(response.body.name).toBe('Slug Test Product');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Product, 'findByPk').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/1')
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('GET /api/products/categories', () => {
    
    it('should get all categories with product counts', async () => {
      await Product.bulkCreate([
        {
          name: 'Cat Product 1',
          description: 'Desc',
          price: 10,
          stock: 5,
          category: 'Category A',
          brand: 'Brand',
          images: ['img.jpg']
        },
        {
          name: 'Cat Product 2',
          description: 'Desc',
          price: 20,
          stock: 3,
          category: 'Category A',
          brand: 'Brand',
          images: ['img.jpg']
        },
        {
          name: 'Cat Product 3',
          description: 'Desc',
          price: 30,
          stock: 8,
          category: 'Category B',
          brand: 'Brand',
          images: ['img.jpg']
        }
      ]);

      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('count');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Product, 'findAll').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/categories')
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('GET /api/products/search', () => {
    
    beforeEach(async () => {
      await Product.create({
        name: 'Searchable Product',
        description: 'This is searchable',
        price: 25.99,
        stock: 10,
        category: 'Search Category',
        brand: 'Search Brand',
        images: ['search.jpg']
      });
    });

    it('should search products successfully', async () => {
      const response = await request(app)
        .get('/api/products/search?q=Searchable')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('searchQuery');
      expect(response.body.searchQuery).toBe('Searchable');
      expect(response.body.products.length).toBeGreaterThan(0);
    });

    it('should return 400 if search query is missing', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .expect(400);

      expect(response.body.message).toBe('Search query is required');
    });

    it('should filter search results by category', async () => {
      const response = await request(app)
        .get('/api/products/search?q=Product&category=Search Category')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
      response.body.products.forEach(product => {
        expect(product.category).toContain('Search Category');
      });
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Product, 'findAndCountAll').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/search?q=test')
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('GET /api/products/suggestions', () => {
    
    it('should get product suggestions', async () => {
      await Product.create({
        name: 'Suggestion Product',
        description: 'Test',
        price: 15.99,
        stock: 5,
        category: 'Test',
        brand: 'Test',
        images: ['test.jpg']
      });

      const response = await request(app)
        .get('/api/products/suggestions?q=Suggestion')
        .expect(200);

      expect(response.body).toHaveProperty('suggestions');
      expect(Array.isArray(response.body.suggestions)).toBe(true);
    });

    it('should return empty array for short query', async () => {
      const response = await request(app)
        .get('/api/products/suggestions?q=a')
        .expect(200);

      expect(response.body.suggestions).toEqual([]);
    });

    it('should limit suggestions', async () => {
      await Product.bulkCreate([
        { name: 'Sug 1', description: 'D', price: 10, stock: 5, category: 'C', brand: 'B', images: ['i.jpg'] },
        { name: 'Sug 2', description: 'D', price: 10, stock: 5, category: 'C', brand: 'B', images: ['i.jpg'] },
        { name: 'Sug 3', description: 'D', price: 10, stock: 5, category: 'C', brand: 'B', images: ['i.jpg'] }
      ]);

      const response = await request(app)
        .get('/api/products/suggestions?q=Sug&limit=2')
        .expect(200);

      expect(response.body.suggestions.length).toBeLessThanOrEqual(2);
    });
  });
});
