const rateLimit = require("express-rate-limit");

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const generalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests from this IP, please try again later"
);

const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later"
);

const passwordResetLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset requests per hour
  "Too many password reset attempts, please try again later"
);

const orderLimiter = createLimiter(
  60 * 1000, // 1 minute
  5, // limit each IP to 5 orders per minute
  "Too many order attempts, please try again later"
);

const adminLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // higher limit for admin operations
  "Too many admin requests, please try again later"
);

const uploadLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 uploads per 15 minutes
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