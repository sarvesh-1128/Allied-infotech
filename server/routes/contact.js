// Route bindings for contact and RFQ API endpoints
const express = require('express');
const router = express.Router();

const { handleContactForm, handleRfqForm } = require('../controllers/contactController');
const { validateContactInput } = require('../middleware/validation');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact → apply rateLimiter, validation, and handler
router.post('/contact', contactLimiter, validateContactInput, handleContactForm);

// POST /api/rfq → RFQ configuration submissions (routed to same email)
router.post('/rfq', contactLimiter, handleRfqForm);

module.exports = router;
