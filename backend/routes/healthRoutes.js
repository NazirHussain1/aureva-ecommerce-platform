const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// Health check endpoint
router.get('/health', asyncHandler(async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: 'pending_mongodb_integration'
  };

  res.status(200).json(health);
}));

// Readiness check
router.get('/ready', asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'ready' });
}));

// Liveness check
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
