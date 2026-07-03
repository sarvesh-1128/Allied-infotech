// Express Rate Limiter for secure form submission thresholds
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 5, // Limit each IP to 5 contact submissions per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many contact enquiries sent from this network. Please try again after 10 minutes.'
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});

module.exports = {
  contactLimiter
};
