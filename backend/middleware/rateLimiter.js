const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for heavy operations
const heavyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 heavy requests per hour
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Heavy operation rate limit exceeded.'
    }
  }
});

module.exports = { limiter, heavyLimiter };