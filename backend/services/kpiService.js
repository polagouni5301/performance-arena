const KPI_CONFIG = require('../config/kpiConfig');
const dataService = require('./dataService');

class KPIService {
  /**
   * Calculates KPI scores for a user based on their performance metrics.
   * @param {string} userId - User ID
   * @param {Date} date - Date for metrics (optional, defaults to latest)
   * @returns {Object} - KPI breakdown with scores and weights
   */
  calculateKPIScores(userId, date = null) {
    const metrics = dataService.getData('performanceMetrics');
    const userMetrics = metrics.filter(m => m.user_id === userId);

    // Filter by date if provided
    let relevantMetrics = userMetrics;
    if (date) {
      const targetDate = date.toISOString().split('T')[0];
      relevantMetrics = userMetrics.filter(m => m.date.startsWith(targetDate));
    }

    // Group metrics by key (take latest value per key)
    const latestMetrics = {};
    relevantMetrics.forEach(metric => {
      if (!latestMetrics[metric.metric_key] || new Date(metric.date) > new Date(latestMetrics[metric.metric_key].date)) {
        latestMetrics[metric.metric_key] = metric;
      }
    });

    const kpiResults = {};
    let totalWeightedScore = 0;
    let totalWeightage = 0;

    Object.keys(KPI_CONFIG).forEach(kpiKey => {
      const config = KPI_CONFIG[kpiKey];
      const metric = latestMetrics[kpiKey];

      if (metric) {
        const rawScore = config.formula(metric.value, config.target);
        const weightedScore = (rawScore * config.weightage) / 100;

        kpiResults[kpiKey] = {
          name: config.name,
          value: metric.value,
          target: config.target,
          unit: config.unit,
          rawScore: Math.round(rawScore * 100) / 100,
          weightage: config.weightage,
          weightedScore: Math.round(weightedScore * 100) / 100,
          status: this.getStatus(rawScore)
        };

        totalWeightedScore += weightedScore;
        totalWeightage += config.weightage;
      } else {
        // No data for this KPI
        kpiResults[kpiKey] = {
          name: config.name,
          value: null,
          target: config.target,
          unit: config.unit,
          rawScore: 0,
          weightage: config.weightage,
          weightedScore: 0,
          status: 'no-data'
        };
      }
    });

    const overallScore = totalWeightage > 0 ? Math.round((totalWeightedScore / totalWeightage) * 100) : 0;

    return {
      userId,
      date: date ? date.toISOString() : new Date().toISOString(),
      kpiBreakdown: kpiResults,
      overallScore,
      totalWeightage,
      explanation: `Overall score = Σ(weighted scores) / total weightage. Weighted score = raw score × weightage / 100.`
    };
  }

  /**
   * Determines status based on score percentage.
   * @param {number} score - Score percentage (0-100)
   * @returns {string} - Status label
   */
  getStatus(score) {
    if (score >= 95) return 'excellent';
    if (score >= 80) return 'on-track';
    if (score >= 60) return 'at-risk';
    return 'critical';
  }

  /**
   * Updates KPI configuration dynamically.
   * @param {Object} updates - Key-value pairs to update
   */
  updateKPIConfig(updates) {
    Object.assign(KPI_CONFIG, updates);
  }

  /**
   * Gets current KPI configuration.
   * @returns {Object} - KPI config
   */
  getKPIConfig() {
    return KPI_CONFIG;
  }

  /**
   * Example calculation for demonstration.
   */
  getSampleCalculation() {
    return {
      userId: 'AGT-001',
      metrics: {
        aht: { value: 350, target: 400 }, // Below target
        qa: { value: 92, target: 95 },    // Slightly below
        revenue: { value: 16000, target: 15000 } // Above target
      },
      calculation: {
        aht: {
          rawScore: 100, // 350 <= 400
          weightedScore: 25, // 100 * 25 / 100
          explanation: 'AHT at 350s (target 400s) = 100% score × 25% weight = 25 points'
        },
        qa: {
          rawScore: 96.84, // 92/95 * 100
          weightedScore: 43.58, // 96.84 * 45 / 100
          explanation: 'QA at 92% (target 95%) = 96.84% score × 45% weight = 43.58 points'
        },
        revenue: {
          rawScore: 106.67, // 16000/15000 * 100
          weightedScore: 32, // 106.67 * 30 / 100
          explanation: 'Revenue at $16K (target $15K) = 106.67% score × 30% weight = 32 points'
        },
        overall: {
          totalWeightedScore: 25 + 43.58 + 32, // 100.58
          totalWeightage: 100,
          overallScore: 100.58, // Rounded to 101 if capped, but here 100.58
          explanation: 'Overall score = 100.58 / 100 = 100.58% (excellent performance)'
        }
      }
    };
  }
}

module.exports = new KPIService();