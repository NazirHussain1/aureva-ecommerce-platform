const rateLimit = require("express-rate-limit");

const isDevelopment = process.env.NODE_ENV === 'development';

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max: isDevelopment ? max * 10 : max, // 10x higher limit in development
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: isDevelopment ? () => false : undefined, // Don't skip in dev, just increase limit
  });
};

const generalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs (1000 in dev)
  "Too many requests from this IP, please try again later"
);

const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs (50 in dev)
  "Too many authentication attempts, please try again later"
);

const passwordResetLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset requests per hour (30 in dev)
  "Too many password reset attempts, please try again later"
);

const orderLimiter = createLimiter(
  60 * 1000, // 1 minute
  5, // limit each IP to 5 orders per minute (50 in dev)
  "Too many order attempts, please try again later"
);

const adminLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // higher limit for admin operations (2000 in dev)
  "Too many admin requests, please try again later"
);

const uploadLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 uploads per 15 minutes (100 in dev)
  "Too many upload attempts, please try again later"
);

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  orderLimiter,
  adminLimiter,
  uploadLimiter,
};