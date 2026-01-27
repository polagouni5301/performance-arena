const cors = require('cors');

const corsOptions = {
  origin: function(origin, callback) {
    console.log('[CORS] Checking origin:', origin || 'NO ORIGIN');
    
    if (!origin) {
      console.log('[CORS] No origin - allowing');
      return callback(null, true);
    }
    
    if (origin.includes('.app.github.dev')) {
      console.log('[CORS] GitHub Codespaces origin - allowing');
      return callback(null, true);
    }
    
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('[CORS] Localhost origin - allowing');
      return callback(null, true);
    }
    
    console.log('[CORS] Other origin - allowing for development:', origin);
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

const corsMiddleware = cors(corsOptions);

// Wrap to add logging
module.exports = (req, res, next) => {
  console.log('[CORS Middleware] Processing', req.method, req.path);
  corsMiddleware(req, res, next);
};