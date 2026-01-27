require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { logger, cors, limiter } = require('./middleware');

const app = express();


// Trust proxy - needed for Codespaces and other proxied environments
app.set('trust proxy', 1);

// CORS - MUST be first, before any other middleware
app.use(cors);

// Security middleware (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: false // Allow CORS
}));

// Logging
app.use(logger);

// Rate limiting
app.use('/api/', limiter); // Apply to all API routes

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// CORS test endpoint
app.options('/api/test', cors);
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working!', headers: req.headers });
});

// Error handling (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;