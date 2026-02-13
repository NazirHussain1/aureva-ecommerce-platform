const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());

// Import routes
const userRoutes = require('../routes/userRoutes');
app.use('/api/users', userRoutes);

// Mock email service
jest.mock('../services/emailService', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
}));

describe('Auth Controller Tests', () => {
  
  describe('POST /api/users/register', () => {
    
    it('should successfully register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'customer'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 if email already exists', async () => {
      const email = `existing${Date.now()}@example.com`;
      const userData = {
        name: 'Test User',
        email: email,
        password: 'Password123!'
      };

      // Create user first
      await User.create(userData);

      // Try to create again
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Email already registered');
    });

    it('should return 500 on server error', async () => {
      // Mock User.findOne to throw error
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const userData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('POST /api/users/login', () => {
    
    it('should successfully login with valid credentials', async () => {
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      const email = `login${Date.now()}@example.com`;
      
      const user = await User.create({
        name: 'Login Test',
        email: email,
        password: hashedPassword,
        role: 'customer'
      });

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: email,
          password: password
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(email);
      
      // Verify token is valid
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.email).toBe(email);
    });

    it('should return 401 with invalid email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 401 with invalid password', async () => {
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      const email = `wrongpass${Date.now()}@example.com`;
      
      await User.create({
        name: 'Wrong Password Test',
        email: email,
        password: hashedPassword,
        role: 'customer'
      });

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: email,
          password: 'WrongPassword!'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('POST /api/users/forgot-password', () => {
    
    it('should send password reset email for valid user', async () => {
      const email = `reset${Date.now()}@example.com`;
      const user = await User.create({
        name: 'Reset Test',
        email: email,
        password: await bcrypt.hash('Password123!', 10),
        role: 'customer'
      });

      const response = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: email })
        .expect(200);

      expect(response.body.message).toBe('Password reset email sent');
      
      // Verify user has reset token
      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.resetPasswordToken).toBeTruthy();
      expect(updatedUser.resetPasswordExpires).toBeTruthy();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('POST /api/users/reset-password', () => {
    
    it('should successfully reset password with valid token', async () => {
      const resetToken = 'valid-reset-token-123';
      const futureDate = new Date(Date.now() + 3600000);
      const email = `resetpass${Date.now()}@example.com`;
      
      const user = await User.create({
        name: 'Reset Password Test',
        email: email,
        password: await bcrypt.hash('OldPassword123!', 10),
        role: 'customer',
        resetPasswordToken: resetToken,
        resetPasswordExpires: futureDate
      });

      const response = await request(app)
        .post('/api/users/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword123!'
        })
        .expect(200);

      expect(response.body.message).toBe('Password reset successful');
      
      // Verify token is cleared
      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.resetPasswordToken).toBeNull();
      expect(updatedUser.resetPasswordExpires).toBeNull();
    });

    it('should return 400 with invalid token', async () => {
      const response = await request(app)
        .post('/api/users/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'NewPassword123!'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid or expired reset token');
    });

    it('should return 400 with expired token', async () => {
      const resetToken = `expired-token-${Date.now()}`;
      const pastDate = new Date(Date.now() - 3600000);
      const email = `expired${Date.now()}@example.com`;
      
      await User.create({
        name: 'Expired Token Test',
        email: email,
        password: await bcrypt.hash('Password123!', 10),
        role: 'customer',
        resetPasswordToken: resetToken,
        resetPasswordExpires: pastDate
      });

      const response = await request(app)
        .post('/api/users/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword123!'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid or expired reset token');
    });
  });
});
