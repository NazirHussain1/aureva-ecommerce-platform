const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Security configuration
const securityConfig = (app) => {
  // Set security HTTP headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:3001',
      ].filter(Boolean);

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));

  // Data sanitization against NoSQL injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  // app.use(hpp({
  //   whitelist: ['price', 'rating', 'category']
  // }));
};

module.exports = securityConfig;
