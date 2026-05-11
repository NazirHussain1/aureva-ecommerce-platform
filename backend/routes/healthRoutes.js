const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware/errorHandler');

// Health check endpoint
router.get('/health', asyncHandler(async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
  };

  // Check MongoDB connection
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  health.database = {
    status: dbStates[dbState],
    name: mongoose.connection.name || 'N/A'
  };

  // Return 503 if database is not connected
  if (dbState !== 1) {
    health.message = 'Service Unavailable - Database not connected';
    return res.status(503).json(health);
  }

  res.status(200).json(health);
}));

// Readiness check
router.get('/ready', asyncHandler(async (req, res) => {
  const isReady = mongoose.connection.readyState === 1;
  
  if (isReady) {
    res.status(200).json({ 
      status: 'ready',
      database: 'connected'
    });
  } else {
    res.status(503).json({ 
      status: 'not ready',
      database: 'disconnected'
    });
  }
}));

// Liveness check
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
