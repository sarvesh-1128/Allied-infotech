// Form Field Validation & Input Sanitization Middleware
const logger = require('../utils/logger');

// Simple HTML/Script tag stripper for input sanitization
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

function validateContactInput(req, res, next) {
  logger.info('Running request validation checks on incoming post payload');
  const { name, email, subject, phone, message, company } = req.body;

  const errors = {};

  // Sanitize fields and bind back to req.body
  req.body.name = sanitize(name);
  req.body.company = sanitize(company || '');
  req.body.subject = sanitize(subject);
  req.body.phone = sanitize(phone);
  req.body.message = sanitize(message);

  // 1. Required Field Checks
  if (!req.body.name) {
    errors.name = 'Full Name is required.';
  }
  
  if (!req.body.subject) {
    errors.subject = 'Subject is required.';
  }
  
  if (!req.body.message) {
    errors.message = 'Enquiry Details are required.';
  }

  // 2. Email format validation
  if (!email) {
    errors.email = 'Business Email is required.';
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid business email address.';
    }
  }

  // 3. Phone format validation
  if (!phone) {
    errors.phone = 'Phone Number is required.';
  } else {
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = 'Please enter a valid contact phone number (10-20 digits).';
    }
  }

  // If validation errors exist, fail fast
  if (Object.keys(errors).length > 0) {
    logger.warn('Validation failed for contact request', errors);
    return res.status(400).json({
      success: false,
      message: 'Invalid form inputs. Please correct mistakes and retry.',
      errors
    });
  }

  // Proceed to next middleware
  next();
}

module.exports = {
  validateContactInput
};
