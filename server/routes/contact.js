// Route bindings for contact API
const express = require('express');
const router = express.Router();

const { handleContactForm } = require('../controllers/contactController');
const { validateContactInput } = require('../middleware/validation');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact -> apply rateLimiter, validation, and handler
router.post('/contact', contactLimiter, validateContactInput, handleContactForm);

module.exports = router;
