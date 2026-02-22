const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
    });
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again after 15 minutes.',
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      email: req.body.email,
    });
    res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts, please try again after 15 minutes.',
    });
  },
});

// OTP rate limiter
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 OTP requests per hour
  message: 'Too many OTP requests, please try again after 1 hour.',
  handler: (req, res) => {
    logger.warn('OTP rate limit exceeded', {
      ip: req.ip,
      email: req.body.email,
    });
    res.status(429).json({
      status: 'error',
      message: 'Too many OTP requests, please try again after 1 hour.',
    });
  },
});

// Contact form rate limiter
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 contact submissions per hour
  message: 'Too many contact form submissions, please try again later.',
  handler: (req, res) => {
    logger.warn('Contact form rate limit exceeded', {
      ip: req.ip,
      email: req.body.email,
    });
    res.status(429).json({
      status: 'error',
      message: 'Too many contact form submissions, please try again later.',
    });
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter,
  contactLimiter,
};
