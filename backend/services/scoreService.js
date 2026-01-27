const dataService = require('./dataService');
const kpiService = require('./kpiService');

class ScoreService {
  /**
   * Aggregates scores for multiple users (e.g., team or org level).
   * @param {Array<string>} userIds - List of user IDs
   * @param {string} period - Period for aggregation (daily, weekly, monthly)
   * @returns {Object} - Aggregated scores
   */
  aggregateScores(userIds, period = 'daily') {
    const scores = userIds.map(userId => kpiService.calculateKPIScores(userId));

    const aggregatedKPIs = {};
    Object.keys(kpiService.getKPIConfig()).forEach(kpiKey => {
      const kpiScores = scores.map(s => s.kpiBreakdown[kpiKey]).filter(s => s.value !== null);
      if (kpiScores.length > 0) {
        const avgValue = kpiScores.reduce((sum, s) => sum + s.value, 0) / kpiScores.length;
        const avgScore = kpiScores.reduce((sum, s) => sum + s.rawScore, 0) / kpiScores.length;

        aggregatedKPIs[kpiKey] = {
          averageValue: Math.round(avgValue * 100) / 100,
          averageScore: Math.round(avgScore * 100) / 100,
          count: kpiScores.length,
          status: kpiService.getStatus(avgScore)
        };
      }
    });

    const avgOverallScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;

    return {
      period,
      userCount: userIds.length,
      aggregatedKPIs,
      averageOverallScore: Math.round(avgOverallScore * 100) / 100,
      breakdown: scores // Individual breakdowns
    };
  }

  /**
   * Calculates leaderboard scores and rankings.
   * @param {string} period - Period type (weekly, monthly)
   * @returns {Array} - Ranked users
   */
  calculateLeaderboard(period = 'weekly') {
    const users = dataService.getData('users');
    const leaderboardData = dataService.getData('leaderboard');

    // Filter by period
    const periodData = leaderboardData.filter(entry => entry.period === period);

    // Calculate current scores if not in data
    const rankings = users.map(user => {
      const existingEntry = periodData.find(entry => entry.user_id === user.user_id);
      if (existingEntry) {
        return {
          user_id: user.user_id,
          name: user.name,
          total_points: existingEntry.total_points,
          total_xp: existingEntry.total_xp,
          score: existingEntry.score,
          rank: existingEntry.rank
        };
      } else {
        // Calculate from KPIs
        const kpiResult = kpiService.calculateKPIScores(user.user_id);
        return {
          user_id: user.user_id,
          name: user.name,
          total_points: Math.round(kpiResult.overallScore * 10), // Example conversion
          total_xp: Math.round(kpiResult.overallScore * 5),
          score: kpiResult.overallScore,
          rank: 0 // Will be set after sorting
        };
      }
    });

    // Sort by score descending
    rankings.sort((a, b) => b.score - a.score);

    // Assign ranks
    rankings.forEach((user, index) => {
      user.rank = index + 1;
    });

    return rankings;
  }

  /**
   * Gets performance trends over time.
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look back
   * @returns {Array} - Daily scores
   */
  getPerformanceTrend(userId, days = 7) {
    const trend = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const score = kpiService.calculateKPIScores(userId, date);
      trend.push({
        date: date.toISOString().split('T')[0],
        score: score.overallScore
      });
    }

    return trend;
  }

  /**
   * Example aggregation for a team.
   */
  getSampleAggregation() {
    return {
      team: 'Sales Alpha',
      period: 'weekly',
      users: ['AGT-001', 'AGT-002', 'AGT-003'],
      aggregatedKPIs: {
        aht: { averageValue: 375, averageScore: 95, count: 3, status: 'excellent' },
        qa: { averageValue: 93, averageScore: 97.9, count: 3, status: 'excellent' },
        revenue: { averageValue: 15500, averageScore: 103.3, count: 3, status: 'excellent' }
      },
      averageOverallScore: 98.7,
      explanation: 'Team average calculated as mean of individual KPI scores, then weighted average for overall.'
    };
  }
}

module.exports = new ScoreService();