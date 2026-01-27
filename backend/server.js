const app = require('./app');
require('dotenv').config();
const dataService = require('./services/dataService');
const guidesService = require('./services/guidesService');

const PORT = process.env.PORT || 3000;

// Load data on startup
async function initializeData() {
  try {
    await dataService.loadData();
    guidesService.loadFromCSV();
    guidesService.recalculateAll();
    console.log('Data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize data:', error.message);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await initializeData();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}

startServer().catch(console.error);