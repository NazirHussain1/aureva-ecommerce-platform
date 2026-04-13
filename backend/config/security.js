const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Security configuration
const securityConfig = (app) => {
  const mongoSanitizeOptions = {
    replaceWith: '_',
    onSanitize: ({ key }) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Sanitized key: ${key}`);
      }
    },
  };

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
        'http://localhost:4173',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:4173',
        'http://127.0.0.1:5173',
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

  // Express 5 exposes req.query as a getter-only property, so sanitize mutable inputs manually.
  app.use((req, res, next) => {
    ['body', 'params'].forEach((key) => {
      if (!req[key] || typeof req[key] !== 'object') {
        return;
      }

      const wasSanitized = mongoSanitize.has(req[key], mongoSanitizeOptions.allowDots);
      mongoSanitize.sanitize(req[key], mongoSanitizeOptions);

      if (wasSanitized) {
        mongoSanitizeOptions.onSanitize({ req, key });
      }
    });

    next();
  });

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  // app.use(hpp({
  //   whitelist: ['price', 'rating', 'category']
  // }));
};

module.exports = securityConfig;
