const dataService = require('./dataService');
const kpiService = require('./kpiService');
const scoreService = require('./scoreService');

class RoleService {
  /**
   * Filters and shapes data based on user role.
   * @param {string} role - User role (agent, manager, leadership, admin)
   * @param {string} userId - User ID
   * @param {Object} params - Additional params (e.g., teamId for managers)
   * @returns {Object} - Role-appropriate data
   */
  getRoleData(role, userId, params = {}) {
    const user = this.getUser(userId);
    if (!user) throw new Error('User not found');

    switch (role) {
      case 'agent':
        return this.getAgentData(userId);
      case 'manager':
        return this.getManagerData(userId, params);
      case 'leadership':
        return this.getLeadershipData(params);
      case 'admin':
        return this.getAdminData(params);
      default:
        throw new Error('Invalid role');
    }
  }

  /**
   * Agent data: Individual metrics only.
   */
  getAgentData(userId) {
    const kpiScores = kpiService.calculateKPIScores(userId);
    const performanceTrend = scoreService.getPerformanceTrend(userId, 7);
    const pointsLedger = dataService.getData('pointsLedger').filter(entry => entry.user_id === userId);

    return {
      userId,
      role: 'agent',
      kpiScores,
      performanceTrend,
      pointsHistory: pointsLedger.slice(-10), // Last 10 entries
      gamification: this.getGamificationData(userId),
      restricted: ['team-aggregates', 'org-insights', 'admin-configs']
    };
  }

  /**
   * Manager data: Team rollups + individual insights.
   */
  getManagerData(managerId, params) {
    const manager = this.getUser(managerId);
    const teamUsers = dataService.getData('users').filter(u => u.manager_id === managerId || u.team_id === manager.team_id);

    const teamIds = teamUsers.map(u => u.user_id);
    const teamAggregation = scoreService.aggregateScores(teamIds, params.period || 'weekly');

    // Add insights for each team member
    teamAggregation.members = teamUsers.map(user => ({
      userId: user.user_id,
      name: user.name,
      kpiScores: kpiService.calculateKPIScores(user.user_id),
      status: this.getAttentionStatus(user.user_id)
    }));

    return {
      managerId,
      role: 'manager',
      teamName: manager.team_id,
      teamAggregation,
      contests: this.getContestsForManager(managerId),
      rewardsAudit: this.getRewardsAudit(managerId),
      restricted: ['org-level-data', 'admin-configs']
    };
  }

  /**
   * Leadership data: Org-level insights.
   */
  getLeadershipData(params = {}) {
    const allUsers = dataService.getData('users');
    const orgAggregation = scoreService.aggregateScores(allUsers.map(u => u.user_id), params.period || 'monthly');

    // Department breakdowns
    const departments = [...new Set(allUsers.map(u => u.department))];
    const departmentBreakdowns = departments.map(dept => {
      const deptUsers = allUsers.filter(u => u.department === dept).map(u => u.user_id);
      return {
        department: dept,
        aggregation: scoreService.aggregateScores(deptUsers, params.period || 'monthly')
      };
    });

    return {
      role: 'leadership',
      orgAggregation,
      departmentBreakdowns,
      leaderboard: scoreService.calculateLeaderboard(params.timeRange || 'monthly'),
      reports: this.getLeadershipReports(params),
      roi: this.calculateROI(),
      restricted: ['individual-details', 'admin-configs']
    };
  }

  /**
   * Admin data: Full visibility + configs.
   */
  getAdminData(params) {
    return {
      role: 'admin',
      overview: this.getAdminOverview(),
      metricsConfig: kpiService.getKPIConfig(),
      pointsRules: this.getPointsRules(),
      rewardsCatalog: dataService.getData('rewardsCatalog'),
      auditLogs: this.getAuditLogs(params),
      systemHealth: this.getSystemHealth(),
      unrestricted: true
    };
  }

  // Helper methods

  getUser(userId) {
    return dataService.getData('users').find(u => u.user_id === userId);
  }

  getGamificationData(userId) {
    const ledger = dataService.getData('pointsLedger').filter(entry => entry.user_id === userId);
    const totalPoints = ledger.reduce((sum, entry) => sum + entry.points, 0);
    const totalXP = ledger.reduce((sum, entry) => sum + entry.xp, 0);

    // Calculate level based on XP (example: level = floor(sqrt(xp/100)))
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const nextLevelXP = (level * level) * 100;
    const levelProgress = ((totalXP % 100) / 100) * 100; // Simplified

    return {
      totalPoints,
      totalXP,
      level,
      nextLevelXP,
      levelProgress,
      currentStreak: this.calculateStreak(userId),
      tokensEarned: Math.floor(totalPoints / 10), // Example
      wheelUnlocked: totalPoints >= 250
    };
  }

  calculateStreak(userId) {
    // Simplified streak calculation
    const ledger = dataService.getData('pointsLedger')
      .filter(entry => entry.user_id === userId && entry.type === 'earned')
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];

    for (const entry of ledger) {
      const entryDate = entry.date.split('T')[0];
      if (entryDate === today || this.isConsecutive(today, entryDate)) {
        streak++;
        today = entryDate;
      } else {
        break;
      }
    }

    return streak;
  }

  isConsecutive(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d1 - d2);
    return diff === 24 * 60 * 60 * 1000; // 1 day
  }

  getAttentionStatus(userId) {
    const scores = kpiService.calculateKPIScores(userId);
    const criticalKPIs = Object.values(scores.kpiBreakdown).filter(kpi => kpi.status === 'critical');
    return criticalKPIs.length > 0 ? 'needs-attention' : 'on-track';
  }

  getContestsForManager(managerId) {
    // Placeholder for contests logic
    return [
      { id: 1, name: 'Q1 Revenue Sprint', status: 'live', progress: 67 }
    ];
  }

  getRewardsAudit(managerId) {
    // Placeholder
    return { totalDistributed: 145680, remainingBudget: 4320 };
  }

  getLeadershipReports(params) {
    // Placeholder
    return { revenueData: [], kpiMetrics: [] };
  }

  calculateROI() {
    // Placeholder
    return { totalSpent: 420000, totalGain: 1780000, roiMultiplier: 4.24 };
  }

  getAdminOverview() {
    const users = dataService.getData('users');
    return {
      activeUsers: users.filter(u => u.status === 'active').length,
      activeContests: 8,
      rewardsInStock: 156,
      criticalWarnings: 3
    };
  }

  getPointsRules() {
    return {
      kpiWeightage: kpiService.getKPIConfig(),
      tierMultipliers: { topTier: { multiplier: 1.5 } },
      globalCaps: { daily: { enabled: true, value: 5000 } }
    };
  }

  getAuditLogs(params) {
    const ledger = dataService.getData('pointsLedger');
    return {
      total: ledger.length,
      logs: ledger.slice(0, 10) // Paginated
    };
  }

  getSystemHealth() {
    return {
      status: 'All Systems Operational',
      apiLatency: '45ms',
      lastSync: new Date().toISOString(),
      errorRate: '0.02%'
    };
  }

  /**
   * Sample role-based data shaping.
   */
  getSampleRoleShaping() {
    return {
      agent: {
        visible: ['personal-kpis', 'gamification', 'individual-leaderboard'],
        hidden: ['team-averages', 'manager-insights', 'org-roi']
      },
      manager: {
        visible: ['team-kpis', 'member-details', 'contests', 'rewards-audit'],
        hidden: ['individual-sensitive-data', 'admin-configs']
      },
      leadership: {
        visible: ['org-kpis', 'department-breakdowns', 'roi-analysis', 'reports'],
        hidden: ['individual-performance-details', 'user-personal-info']
      },
      admin: {
        visible: ['everything', 'system-configs', 'audit-logs'],
        hidden: []
      }
    };
  }
}

module.exports = new RoleService();