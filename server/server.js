// Express Main Server Configuration
const path = require('path');
// Load environment variables from the workspace root .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS with secure options
app.use(cors({
  origin: '*', // For local development, later lock to official domain
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log basic requests in console
app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url} from IP: ${req.ip}`);
  next();
});

// Bind routing triggers under /api
app.use('/api', contactRoutes);

// Global Error Handler middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled internal server error occurred', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please try again later.'
  });
});

// Start listening
app.listen(PORT, () => {
  logger.info(`Corporate Express server started successfully. Listening on port: ${PORT}`);
});
