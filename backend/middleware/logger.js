const morgan = require('morgan');

// Request logging middleware
const logger = morgan('combined');

module.exports = logger;