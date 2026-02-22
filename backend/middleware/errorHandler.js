const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  if (err.statusCode === 500) {
    logger.error('Internal Server Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?.id,
    });
  }

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production error response
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

// Handle unhandled routes
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Sequelize error handler
const handleSequelizeError = (err) => {
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return new AppError(`Validation Error: ${errors.join('. ')}`, 400);
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return new AppError(`${field} already exists`, 400);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return new AppError('Invalid reference to related data', 400);
  }

  return err;
};

// JWT error handler
const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again', 401);

module.exports = {
  AppError,
  asyncHandler,
  errorHandler,
  notFound,
  handleSequelizeError,
  handleJWTError,
  handleJWTExpiredError,
};
