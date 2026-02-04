const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// NoSQL injection prevention
const noSQLInjectionPrevention = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Potential NoSQL injection attempt detected: ${key} from IP: ${req.ip}`);
  },
});

// XSS protection middleware
const xssProtection = (req, res, next) => {
  // Basic XSS protection for string fields
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://your-frontend-domain.com', // Replace with your actual frontend domain
    ];
    
    // Add environment-specific origins
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
    }
    
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /(\<script\>|\<\/script\>)/i,
    /(union.*select|select.*from|insert.*into|delete.*from|drop.*table)/i,
    /(\.\.\/|\.\.\\)/,
    /(\$ne|\$gt|\$lt|\$regex)/i
  ];

  const checkSuspicious = (obj, path = '') => {
    if (typeof obj === 'string') {
      suspiciousPatterns.forEach(pattern => {
        if (pattern.test(obj)) {
          console.warn(`Suspicious pattern detected in ${path}: ${obj.substring(0, 100)} from IP: ${req.ip}`);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        checkSuspicious(obj[key], `${path}.${key}`);
      });
    }
  };

  // Check request body and query parameters
  if (req.body) checkSuspicious(req.body, 'body');
  if (req.query) checkSuspicious(req.query, 'query');

  next();
};

module.exports = {
  securityHeaders,
  noSQLInjectionPrevention,
  xssProtection,
  corsOptions,
  securityLogger
};