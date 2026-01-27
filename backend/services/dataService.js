const fs = require('fs');
const path = require('path');
const { readExcelFile, normalizeData } = require('../utils/excelReader');

class DataService {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.rawDir = path.join(this.dataDir, 'raw');
    this.processedDir = path.join(this.dataDir, 'processed');
    this.cacheDir = path.join(this.dataDir, 'cache');
    this.data = {}; // In-memory cache
  }

  /**
   * Loads and processes Excel data from raw directory.
   * Falls back to existing JSON if Excel not found.
   * @param {string} filename - Excel file name (e.g., 'gamification_data.xlsx')
   */
  async loadData(filename = 'gamification_data.xlsx') {
    const filePath = path.join(this.rawDir, filename);

    try {
      console.log(`Attempting to load Excel data from ${filePath}...`);
      const rawData = readExcelFile(filePath);
      const normalizedData = normalizeData(rawData);

      // Save processed data to JSON files
      await this.saveProcessedData(normalizedData);

      // Load into memory
      this.data = normalizedData;
      console.log('Data loaded from Excel and processed successfully.');
    } catch (excelError) {
      console.log('Excel file not found, loading from existing JSON files...');
      try {
        // Load from processed JSON files
        this.data = {};
        const expectedFiles = ['users', 'performanceMetrics', 'pointsLedger', 'leaderboard', 'rewardsCatalog'];

        for (const file of expectedFiles) {
          const jsonPath = path.join(this.processedDir, `${file}.json`);
          if (fs.existsSync(jsonPath)) {
            this.data[file] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            console.log(`Loaded ${file} from JSON`);
          } else {
            console.log(`Warning: ${file}.json not found, using empty array`);
            this.data[file] = [];
          }
        }
        console.log('Data loaded from JSON files successfully.');
      } catch (jsonError) {
        console.error('Failed to load data from JSON:', jsonError.message);
        throw jsonError;
      }
    }
  }

  /**
   * Saves normalized data to JSON files in processed directory.
   * @param {Object} data - Normalized data object.
   */
  async saveProcessedData(data) {
    for (const [key, value] of Object.entries(data)) {
      const filePath = path.join(this.processedDir, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
    }
  }

  /**
   * Gets data from memory or loads from processed JSON if not cached.
   * @param {string} key - Data key (e.g., 'users', 'performanceMetrics')
   * @returns {Array|Object} - The requested data.
   */
  getData(key) {
    if (this.data[key]) {
      return this.data[key];
    }

    // Load from processed JSON if available
    const filePath = path.join(this.processedDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      this.data[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return this.data[key];
    }

    return [];
  }

  /**
   * Refreshes data by reloading from Excel.
   */
  async refreshData(filename) {
    this.data = {};
    await this.loadData(filename);
  }

  /**
   * Sample Excel → JSON transformation example.
   * Shows how a raw Excel row becomes a normalized JSON object.
   */
  getSampleTransformation() {
    return {
      rawExcelRow: {
        user_id: 'AGT-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        role: 'agent',
        department: 'Sales',
        team_id: 'TEAM-A',
        hire_date: '2023-01-15',
        rank: 'Gold',
        status: 'active'
      },
      normalizedJsonObject: {
        user_id: 'AGT-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        role: 'agent',
        department: 'Sales',
        team_id: 'TEAM-A',
        manager_id: null,
        avatar_url: null,
        hire_date: '2023-01-15T00:00:00.000Z', // ISO format
        rank: 'Gold',
        status: 'active'
      },
      explanation: 'Dates are converted to ISO 8601, missing fields are set to null, numbers are parsed.'
    };
  }
}

module.exports = new DataService();