const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// Health check endpoint
router.get('/health', asyncHandler(async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
  };

  try {
    // Check database connection
    await sequelize.authenticate();
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.message = 'Database connection failed';
    return res.status(503).json(health);
  }

  res.status(200).json(health);
}));

// Readiness check
router.get('/ready', asyncHandler(async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
}));

// Liveness check
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
