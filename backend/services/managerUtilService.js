/**
 * Manager Utility Service
 * Handles manager-specific data retrieval and transformations
 * Provides centralized access to manager information from excel data
 */

const guidesService = require('./guidesService');
const userService = require('./userService');
const dataService = require('./dataService');
const managerReportingService = require('./managerReportingService');

class ManagerUtilService {
  /**
   * Find manager by ID or name
   * Handles both numeric IDs and string IDs like "mgr_1"
   * If manager not found in users DB, will search guides data from Excel to extract manager name
   * @param {string|number} managerId - Manager ID
   * @returns {Object} Manager user object or temporary manager object from Excel data, or null
   */
  findManagerById(managerId) {
    const allUsers = userService.getAllUsers();
    const idStr = String(managerId);
    
    // First try exact match with user_id
    let manager = allUsers.find(u => String(u.user_id) === idStr && u.role === 'manager');
    if (manager) return manager;
    
    // Try finding by manager name if ID doesn't work
    manager = allUsers.find(u => u.name === managerId && u.role === 'manager');
    if (manager) return manager;
    
    // If manager ID not found in users DB, try to find manager by checking guides data
    // This allows the system to fetch data for managers that have guides in Excel
    // even if they haven't been registered/synced as user accounts yet
    const allGuides = guidesService.getAllGuides();
    
    // Get unique manager names from all guides
    const managerNamesInGuides = [...new Set(allGuides.map(g => g.manager).filter(m => m))];
    
    // If we have exactly one manager in guides, or if "Asween" is in the list, use that
    // Otherwise, try to find a manager user with any of these names
    let targetManagerName = null;
    
    if (managerNamesInGuides.includes('Asween')) {
      targetManagerName = 'Asween';
    } else if (managerNamesInGuides.length === 1) {
      targetManagerName = managerNamesInGuides[0];
    } else {
      // Try to find a manager user with any of the names from guides
      for (const managerName of managerNamesInGuides) {
        const foundManager = allUsers.find(u => u.name === managerName && u.role === 'manager');
        if (foundManager) {
          return foundManager;
        }
      }
    }
    
    // If we determined a target manager name, use it
    if (targetManagerName) {
      const foundManager = allUsers.find(u => u.name === targetManagerName && u.role === 'manager');
      if (foundManager) {
        return foundManager;
      }
      
      // If manager not found in users, create a temporary manager object from Excel data
      return {
        user_id: idStr,
        name: targetManagerName,
        email: null,
        role: 'manager',
        department: null,
        team_id: null,
        manager_id: null,
        supervisor_id: null,
        avatar_url: null,
        hire_date: new Date().toISOString(),
        rank: 'Silver',
        status: 'active',
        _source: 'excel_guides_data'  // Flag indicating this came from Excel data
      };
    }
    
    return null;
  }

  /**
   * Get manager structure and details
   * @param {string} managerName - Manager name from users data
   * @returns {Object} Complete manager structure with all departments and guides
   */
  getManagerDetails(managerName) {
    return managerReportingService.getManagerStructure(managerName);
  }

  /**
   * Get all reporting guides for a manager
   * @param {string} managerName - Manager name
   * @returns {Array} All guides (registered and unregistered) under this manager
   */
  getManagerReportingGuides(managerName) {
    const structure = managerReportingService.getManagerStructure(managerName);
    if (!structure) return [];

    const allGuides = [];
    Object.values(structure.departments).forEach(dept => {
      allGuides.push(...dept.guides);
    });
    return allGuides;
  }

  /**
   * Get registered guides only
   * @param {string} managerName - Manager name
   * @returns {Array} Registered guides under this manager
   */
  getRegisteredGuides(managerName) {
    return managerReportingService.getManagerRegisteredGuides(managerName);
  }

  /**
   * Get departments under manager
   * @param {string} managerName - Manager name
   * @returns {Array} Department names
   */
  getManagerDepartments(managerName) {
    return managerReportingService.getManagerDepartments(managerName);
  }

  /**
   * Calculate team health score
   * Based on QA, Participation Rate, and Revenue performance
   * Normalized to 0-100 scale
   * @param {string} managerName - Manager name
   * @returns {number} Team health score (0-100)
   */
  getTeamHealthScore(managerName) {
    const rawScore = managerReportingService.calculateTeamHealthScore(managerName);
    // Normalize to 0-100 if score exceeds 100
    return Math.min(100, Math.max(0, rawScore % 100 || rawScore));
  }

  /**
   * Get participation rate (% of registered guides)
   * @param {string} managerName - Manager name
   * @returns {number} Participation rate percentage
   */
  getParticipationRate(managerName) {
    const structure = managerReportingService.getManagerStructure(managerName);
    if (!structure || structure.totalGuides === 0) return 0;
    return Math.round((structure.registeredGuides / structure.totalGuides) * 100);
  }

  /**
   * Get department metrics (AHT, QA, Revenue, Participation)
   * @param {string} managerName - Manager name
   * @returns {Object} Department-wise metrics
   */
  getDepartmentMetrics(managerName) {
    return managerReportingService.getDepartmentMetrics(managerName);
  }

  /**
   * Get averaged metrics across all departments
   * @param {string} managerName - Manager name
   * @returns {Object} Averaged metrics
   */
  getAveragedMetrics(managerName) {
    const deptMetrics = this.getDepartmentMetrics(managerName);
    const depts = Object.values(deptMetrics);

    if (depts.length === 0) {
      return {
        avgAHT: 0,
        avgQA: 0,
        avgRevenue: 0,
        totalRevenue: 0,
        participationRate: 0,
        newConversionRate: 0
      };
    }

    // Calculate weighted averages
    const totalGuides = depts.reduce((sum, d) => sum + d.guideCount, 0) || 1;
    const avgAHT = depts.reduce((sum, d) => sum + (d.avgAHT * d.guideCount), 0) / totalGuides;
    const avgQA = depts.reduce((sum, d) => sum + (d.avgQA * d.guideCount), 0) / totalGuides;
    const avgRevenue = depts.reduce((sum, d) => sum + (d.avgRevenue * d.guideCount), 0) / totalGuides;
    const totalRevenue = depts.reduce((sum, d) => sum + d.totalRevenue, 0);
    const participationRate = depts.reduce((sum, d) => sum + d.participationRate, 0) / depts.length;

    // Calculate new conversion rate (simulated - could be enhanced)
    const guides = this.getRegisteredGuides(managerName);
    const newConversionRate = guides.length > 0 
      ? Math.round((guides.filter(g => g.metrics.newConv).length / guides.length) * 100)
      : 0;

    return {
      avgAHT: Math.round(avgAHT * 100) / 100,
      avgQA: Math.round(avgQA * 100) / 100,
      avgRevenue: Math.round(avgRevenue * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      participationRate: Math.round(participationRate),
      newConversionRate
    };
  }

  /**
   * Get top 3 performers across all departments
   * @param {string} managerName - Manager name
   * @returns {Array} Top 3 performers with XP and points
   */
  getTopPerformers(managerName, limit = 3) {
    return managerReportingService.getTopPerformers(managerName, limit);
  }

  /**
   * Get bottom performers (attention needed)
   * Includes revenue, AHT, and new conversion rate info
   * @param {string} managerName - Manager name
   * @param {number} limit - Number of guides
   * @returns {Array} Bottom performers with issue details
   */
  getAttentionNeeded(managerName, limit = 5) {
    const guides = this.getRegisteredGuides(managerName);
    return guides
      .map(guide => ({
        name: guide.name,
        avatar: guide.name.split(' ').map(n => n[0]).join(''),
        department: guide.department,
        revenue: guide.metrics.revenue || 0,
        aht: guide.metrics.aht || 0,
        newConvRate: guide.metrics.newConv || 0,
        issue: guide.metrics.revenue < 50 ? 'Low Revenue' :
               guide.metrics.aht > 15 ? 'High AHT' :
               guide.metrics.qa < 3 ? 'Low QA Score' : 'Needs Improvement',
        score: (guide.metrics.revenue * 0.4) + ((6 - guide.metrics.aht) * 10) + (guide.metrics.qa * 5)
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, limit)
      .map(guide => {
        const { score, ...rest } = guide;
        return rest;
      });
  }

  /**
   * Get top performers by metric (AHT, QA, Revenue)
   * Top 4 guides for team performance page
   * @param {string} managerName - Manager name
   * @param {string} metric - 'aht' | 'qa' | 'revenue'
   * @param {number} limit - Number to return
   * @returns {Array} Top performers by specific metric
   */
  getTopPerformersByMetric(managerName, metric, limit = 4) {
    return managerReportingService.getTopByMetric(managerName, metric, limit);
  }

  /**
   * Get total points distributed across manager's departments
   * @param {string} managerName - Manager name
   * @returns {number} Total points distributed
   */
  getTotalPointsDistributed(managerName) {
    return managerReportingService.getTotalPointsDistributed(managerName);
  }

  /**
   * Get points budget info for manager
   * @param {string} managerName - Manager name
   * @returns {Object} Budget information
   */
  getPointsBudget(managerName) {
    const totalBudget = 50000; // Mock - could be configured per manager
    const distributed = this.getTotalPointsDistributed(managerName);
    const remaining = totalBudget - distributed;

    return {
      totalBudget,
      distributed,
      remaining,
      budgetUsagePercent: Math.round((distributed / totalBudget) * 100)
    };
  }

  /**
   * Get reward history for manager's guides
   * Includes guide names instead of IDs
   * @param {string} managerName - Manager name
   * @param {number} limit - Number of entries
   * @returns {Array} Reward history
   */
  getRewardHistory(managerName, limit = 10) {
    return managerReportingService.getRewardHistory(managerName, limit);
  }

  /**
   * Get complete overview data for manager dashboard
   * @param {string} managerId - Manager ID (string)
   * @param {string} managerName - Manager name
   * @returns {Object} Complete overview data
   */
  getOverviewData(managerId, managerName) {
    const structure = managerReportingService.getManagerStructure(managerName) || {
      managerName: managerName,
      departments: {},
      totalGuides: 0,
      registeredGuides: 0
    };

    const metrics = this.getAveragedMetrics(managerName);
    const teamHealth = this.getTeamHealthScore(managerName);
    const budget = this.getPointsBudget(managerName);
    const topPerformers = this.getTopPerformers(managerName, 3);
    const attentionNeeded = this.getAttentionNeeded(managerName, 5);

    return {
      teamName: `${managerName}'s Team`,
      managerId,
      managerName,
      lastUpdated: new Date().toLocaleString(),
      departments: Object.keys(structure.departments),
      departmentCount: Object.keys(structure.departments).length,
      totalGuides: structure.totalGuides,
      registeredGuides: structure.registeredGuides,
      
      // Team Metrics
      teamHealthScore: teamHealth,
      teamHealthChange: 5, // Mock - could calculate from historical data
      participationRate: metrics.participationRate,
      participationChange: 3, // Mock
      
      // Budget Info
      pointsBudget: budget.totalBudget,
      pointsDistributed: budget.distributed,
      pointsRemaining: budget.remaining,
      budgetUsagePercent: budget.budgetUsagePercent,
      
      // Averaged Metrics
      avgMetrics: {
        aht: metrics.avgAHT,
        qa: metrics.avgQA,
        revenue: metrics.avgRevenue,
        totalRevenue: metrics.totalRevenue,
        newConversionRate: metrics.newConversionRate
      },
      
      // Performance Data
      topPerformers,
      attentionNeeded,
      
      // Live Activity
      weeklyData: this.getWeeklyData(),
      liveFeed: this.getLiveFeed(managerName),
      insight: `${structure.registeredGuides} registered guides across ${Object.keys(structure.departments).length} departments with ${metrics.participationRate}% participation rate.`
    };
  }

  /**
   * Get team performance page data
   * @param {string} managerName - Manager name
   * @returns {Object} Team performance data
   */
  getTeamPerformanceData(managerName) {
    const structure = managerReportingService.getManagerStructure(managerName) || {
      departments: {},
      totalGuides: 0
    };

    const topByAHT = this.getTopPerformersByMetric(managerName, 'aht', 4);
    const topByQA = this.getTopPerformersByMetric(managerName, 'qa', 4);
    const topByRevenue = this.getTopPerformersByMetric(managerName, 'revenue', 4);
    const bottomPerformers = this.getAttentionNeeded(managerName, 5);

    // Add ranks
    topByAHT.forEach((item, index) => item.rank = index + 1);
    topByQA.forEach((item, index) => item.rank = index + 1);
    topByRevenue.forEach((item, index) => item.rank = index + 1);

    return {
      departments: Object.keys(structure.departments),
      topPerformers: {
        aht: topByAHT,
        qa: topByQA,
        revenue: topByRevenue
      },
      insightsCoaching: {
        bottomPerformers,
        recommendations: [
          "Focus on AHT reduction for teams showing improvement potential",
          "QA score improvement programs recommended for 2-3 members",
          "Revenue coaching opportunities identified in support departments"
        ]
      },
      lastUpdated: new Date().toLocaleString()
    };
  }

  /**
   * Get rewards audit data
   * @param {string} managerName - Manager name
   * @returns {Object} Rewards audit information
   */
  getRewardsAuditData(managerName) {
    const structure = managerReportingService.getManagerStructure(managerName) || {
      departments: {},
      totalGuides: 0
    };

    try {
      const deptMetrics = this.getDepartmentMetrics(managerName);
      const budget = this.getPointsBudget(managerName);
      const rewardHistory = this.getRewardHistory(managerName, 10);

      // Calculate points by department
      const pointsByDepartment = Object.entries(deptMetrics).map(([dept, metrics]) => ({
        department: dept,
        points: Math.round(metrics.totalRevenue * 10),
        guides: metrics.guideCount,
        avgPoints: Math.round((metrics.totalRevenue * 10) / (metrics.guideCount || 1))
      }));

      return {
        totalDistributed: budget.distributed,
        remainingBudget: budget.remaining,
        totalBudget: budget.totalBudget,
        budgetChange: 8,
        budgetUsagePercent: budget.budgetUsagePercent,
        departments: Object.keys(structure.departments),
        pointsByDepartment,
        rewardHistory,
        liveRedemptions: [],
        fairnessAlert: budget.distributed > 30000 
          ? "High redemption activity detected - review is recommended"
          : "Reward distribution looks balanced"
      };
    } catch (error) {
      // If there's an error, return safe defaults with guide-based data
      const guides = this.getManagerReportingGuides(managerName);
      const depts = new Set(guides.map(g => g.department));
      
      return {
        totalDistributed: 0,
        remainingBudget: 50000,
        totalBudget: 50000,
        budgetChange: 0,
        budgetUsagePercent: 0,
        departments: Array.from(depts),
        pointsByDepartment: Array.from(depts).map(dept => ({
          department: dept,
          points: 0,
          guides: guides.filter(g => g.department === dept).length,
          avgPoints: 0
        })),
        rewardHistory: guides.slice(0, 5).map((g, idx) => ({
          id: idx,
          guideName: g.name,
          reward: "Pending",
          points: 0,
          date: new Date().toLocaleDateString(),
          status: "pending"
        })),
        liveRedemptions: [],
        fairnessAlert: "Reward distribution is being prepared"
      };
    }
  }

  /**
   * Generate weekly data for charts
   * @returns {Array} Weekly performance data
   */
  getWeeklyData() {
    return [
      { day: "Mon", current: 85, previous: 78, target: 80 },
      { day: "Tue", current: 88, previous: 82, target: 80 },
      { day: "Wed", current: 92, previous: 85, target: 80 },
      { day: "Thu", current: 89, previous: 86, target: 80 },
      { day: "Fri", current: 94, previous: 88, target: 80 }
    ];
  }

  /**
   * Generate live feed activity from manager's guides
   * @param {string} managerName - Manager name
   * @returns {Array} Live feed items from actual guides
   */
  getLiveFeed(managerName = null) {
    if (!managerName) {
      return [];
    }
    
    const guides = this.getManagerReportingGuides(managerName);
    if (!guides || guides.length === 0) {
      return [];
    }
    
    // Return top 5 guides by revenue as live feed
    return guides
      .sort((a, b) => (b.metrics.revenue || 0) - (a.metrics.revenue || 0))
      .slice(0, 5)
      .map(guide => ({
        name: guide.name,
        action: "has metrics",
        value: `$${(guide.metrics.revenue || 0).toFixed(2)}`,
        time: "just now",
        dept: guide.department,
        avatar: guide.name.split(' ').map(n => n[0]).join('')
      }));
  }
}

module.exports = new ManagerUtilService();
