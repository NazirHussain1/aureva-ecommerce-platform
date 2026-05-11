require('./loadEnv');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * MongoDB Connection Utility
 * Connects to MongoDB Atlas using Mongoose
 */

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available (for serverless optimization)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    logger.info('📦 Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // MongoDB connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    cachedConnection = conn;

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    
    // Log specific error details
    if (error.name === 'MongoServerError') {
      logger.error('Server Error:', error.message);
    } else if (error.name === 'MongooseServerSelectionError') {
      logger.error('Connection Error: Unable to connect to MongoDB Atlas');
      logger.error('Please check:');
      logger.error('1. MONGODB_URI is correct in .env');
      logger.error('2. IP address is whitelisted in MongoDB Atlas');
      logger.error('3. Database user has correct permissions');
    }

    throw error;
  }
};

/**
 * Gracefully close MongoDB connection
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    cachedConnection = null;
    logger.info('✅ MongoDB connection closed');
  } catch (error) {
    logger.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

module.exports = { connectDB, disconnectDB };
