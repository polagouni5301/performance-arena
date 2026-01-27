/**
 * Manager Reporting Service
 * Handles manager-department-guide relationships and reporting structures
 */

const guidesService = require('./guidesService');
const dataService = require('./dataService');

class ManagerReportingService {
  constructor() {
    this.managerStructure = null;
    this.buildManagerStructure();
  }

  /**
   * Build the manager reporting structure from guides data
   */
  buildManagerStructure() {
    const allGuides = guidesService.getAllGuides();

    // Group guides by manager
    const managersMap = new Map();

    allGuides.forEach(guide => {
      const managerName = guide.manager;
      if (!managersMap.has(managerName)) {
        managersMap.set(managerName, {
          managerName,
          departments: new Map(),
          totalGuides: 0,
          registeredGuides: 0
        });
      }

      const managerData = managersMap.get(managerName);

      // Group by department
      if (!managerData.departments.has(guide.department)) {
        managerData.departments.set(guide.department, {
          departmentName: guide.department,
          guides: [],
          registeredGuides: []
        });
      }

      const deptData = managerData.departments.get(guide.department);
      deptData.guides.push(guide);

      if (guide.registered) {
        deptData.registeredGuides.push(guide);
        managerData.registeredGuides++;
      }

      managerData.totalGuides++;
    });

    // Convert Maps to objects for easier use
    this.managerStructure = {};
    managersMap.forEach((managerData, managerName) => {
      this.managerStructure[managerName] = {
        ...managerData,
        departments: Object.fromEntries(managerData.departments)
      };
    });
  }

  /**
   * Get manager reporting structure
   * Case-insensitive lookup to handle "Asween" vs "asween"
   * @param {string} managerName - Manager name
   * @returns {Object} Manager structure with departments and guides
   */
  getManagerStructure(managerName) {
    // Try exact match first
    if (this.managerStructure[managerName]) {
      return this.managerStructure[managerName];
    }
    
    // Try case-insensitive match
    const lowerName = String(managerName).toLowerCase();
    for (const key in this.managerStructure) {
      if (key.toLowerCase() === lowerName) {
        return this.managerStructure[key];
      }
    }
    
    return null;
  }

  /**
   * Get all departments under a manager
   * @param {string} managerName - Manager name
   * @returns {Array} Array of department names
   */
  getManagerDepartments(managerName) {
    const structure = this.getManagerStructure(managerName);
    return structure ? Object.keys(structure.departments) : [];
  }

  /**
   * Get all guides under a manager (across all departments)
   * @param {string} managerName - Manager name
   * @returns {Array} Array of guide objects
   */
  getManagerGuides(managerName) {
    const structure = this.getManagerStructure(managerName);
    if (!structure) return [];

    const allGuides = [];
    Object.values(structure.departments).forEach(dept => {
      allGuides.push(...dept.guides);
    });
    return allGuides;
  }

  /**
   * Get registered guides under a manager
   * @param {string} managerName - Manager name
   * @returns {Array} Array of registered guide objects
   */
  getManagerRegisteredGuides(managerName) {
    const structure = this.getManagerStructure(managerName);
    if (!structure) return [];

    const registeredGuides = [];
    Object.values(structure.departments).forEach(dept => {
      registeredGuides.push(...dept.registeredGuides);
    });
    return registeredGuides;
  }

  /**
   * Get department-wise metrics for a manager
   * Includes ALL guides (registered and unregistered) since all have metrics in Excel
   * @param {string} managerName - Manager name
   * @returns {Object} Department-wise aggregated metrics
   */
  getDepartmentMetrics(managerName) {
    const structure = this.getManagerStructure(managerName);
    if (!structure) return {};

    const deptMetrics = {};

    Object.entries(structure.departments).forEach(([deptName, deptData]) => {
      // Use ALL guides, not just registered ones, since all have metrics in Excel
      const guides = deptData.guides;
      if (guides.length === 0) {
        deptMetrics[deptName] = {
          guideCount: 0,
          avgAHT: 0,
          avgQA: 0,
          avgRevenue: 0,
          totalRevenue: 0,
          participationRate: 0
        };
        return;
      }

      const metrics = {
        guideCount: guides.length,
        avgAHT: guides.reduce((sum, g) => sum + g.metrics.aht, 0) / guides.length,
        avgQA: guides.reduce((sum, g) => sum + g.metrics.qa, 0) / guides.length,
        avgRevenue: guides.reduce((sum, g) => sum + g.metrics.revenue, 0) / guides.length,
        totalRevenue: guides.reduce((sum, g) => sum + g.metrics.revenue, 0),
        participationRate: (guides.length / deptData.guides.length) * 100
      };

      deptMetrics[deptName] = metrics;
    });

    return deptMetrics;
  }

  /**
   * Calculate team health score for manager's departments
   * @param {string} managerName - Manager name
   * @returns {number} Team health score (0-100)
   */
  calculateTeamHealthScore(managerName) {
    const deptMetrics = this.getDepartmentMetrics(managerName);
    const depts = Object.values(deptMetrics);

    if (depts.length === 0) return 0;

    // Calculate weighted average based on participation and performance
    const totalGuides = depts.reduce((sum, dept) => sum + dept.guideCount, 0);
    let weightedScore = 0;

    depts.forEach(dept => {
      const weight = dept.guideCount / totalGuides;
      // Health score based on QA, participation, and revenue performance
      const deptScore = (dept.avgQA / 5) * 40 + (dept.participationRate / 100) * 30 + Math.min(dept.avgRevenue / 100, 1) * 30;
      weightedScore += deptScore * weight;
    });

    return Math.round(weightedScore);
  }

  /**
   * Get top performers across all manager's departments
   * Includes ALL guides (registered and unregistered) since all have metrics in Excel
   * @param {string} managerName - Manager name
   * @param {number} limit - Number of top performers to return
   * @returns {Array} Top performing guides by XP
   */
  getTopPerformers(managerName, limit = 3) {
    // Use ALL guides, not just registered ones, since all have metrics in Excel
    const guides = this.getManagerGuides(managerName);
    return guides
      .sort((a, b) => b.calculated.xp - a.calculated.xp)
      .slice(0, limit)
      .map(guide => ({
        name: guide.name,
        avatar: guide.name.split(' ').map(n => n[0]).join(''),
        department: guide.department,
        xp: guide.calculated.xp,
        points: guide.calculated.points,
        level: Math.floor(Math.sqrt(guide.calculated.xp / 100)) + 1
      }));
  }

  /**
   * Get guides needing attention (bottom performers)
   * Includes ALL guides (registered and unregistered) since all have metrics in Excel
   * @param {string} managerName - Manager name
   * @param {number} limit - Number of guides to return
   * @returns {Array} Guides needing attention
   */
  getAttentionNeeded(managerName, limit = 5) {
    // Use ALL guides, not just registered ones, since all have metrics in Excel
    const guides = this.getManagerGuides(managerName);
    return guides
      .sort((a, b) => {
        // Sort by combined performance (lower is worse)
        const scoreA = (a.metrics.revenue * 0.4) + ((6 - a.metrics.aht) * 10) + (a.metrics.qa * 5);
        const scoreB = (b.metrics.revenue * 0.4) + ((6 - b.metrics.aht) * 10) + (b.metrics.qa * 5);
        return scoreA - scoreB; // Ascending (worst first)
      })
      .slice(0, limit)
      .map(guide => ({
        name: guide.name,
        avatar: guide.name.split(' ').map(n => n[0]).join(''),
        department: guide.department,
        issue: guide.metrics.revenue < 50 ? 'Low Revenue' :
               guide.metrics.aht > 15 ? 'High AHT' :
               guide.metrics.qa < 3 ? 'Low QA Score' : 'Needs Improvement',
        metric: guide.metrics.revenue < 50 ? `$${guide.metrics.revenue}` :
                guide.metrics.aht > 15 ? `${guide.metrics.aht}min` :
                guide.metrics.qa < 3 ? `${guide.metrics.qa}/5` : 'Multiple Issues'
      }));
  }

  /**
   * Get top performers by specific metrics
   * Includes ALL guides (registered and unregistered) since all have metrics in Excel
   * @param {string} managerName - Manager name
   * @param {string} metric - 'aht', 'qa', 'revenue'
   * @param {number} limit - Number of guides to return
   * @returns {Array} Top performers by metric
   */
  getTopByMetric(managerName, metric, limit = 4) {
    // Use ALL guides, not just registered ones, since all have metrics in Excel
    const guides = this.getManagerGuides(managerName);
    return guides
      .sort((a, b) => {
        if (metric === 'aht') return a.metrics.aht - b.metrics.aht; // Lower AHT is better
        if (metric === 'qa') return b.metrics.qa - a.metrics.qa; // Higher QA is better
        if (metric === 'revenue') return b.metrics.revenue - a.metrics.revenue; // Higher revenue is better
        return 0;
      })
      .slice(0, limit)
      .map(guide => ({
        name: guide.name,
        avatar: guide.name.split(' ').map(n => n[0]).join(''),
        department: guide.department,
        value: metric === 'revenue' ? `$${guide.metrics[metric]}` : guide.metrics[metric],
        rank: 0 // Will be set by caller
      }));
  }

  /**
   * Calculate total points distributed to manager's departments
   * Includes ALL guides (registered and unregistered) since all have metrics in Excel
   * @param {string} managerName - Manager name
   * @returns {number} Total points distributed
   */
  getTotalPointsDistributed(managerName) {
    // Use ALL guides, not just registered ones, since all have metrics in Excel
    const guides = this.getManagerGuides(managerName);
    const guideIds = guides.map(g => g.guide_id);

    // Get points ledger and sum negative points (redemptions) for these guides
    const ledger = dataService.getData('pointsLedger');
    return ledger
      .filter(entry => guideIds.includes(entry.user_id) && entry.points < 0)
      .reduce((sum, entry) => sum + Math.abs(entry.points), 0);
  }

  /**
   * Get reward history for manager's guides
   * Includes ALL guides (registered and unregistered) since all have metrics in Excel
   * @param {string} managerName - Manager name
   * @param {number} limit - Number of entries to return
   * @returns {Array} Reward history entries
   */
  getRewardHistory(managerName, limit = 10) {
    // Use ALL guides, not just registered ones, since all have metrics in Excel
    const guides = this.getManagerGuides(managerName);
    const guideIds = guides.map(g => g.guide_id);
    const guideMap = new Map(guides.map(g => [g.guide_id, g]));

    const ledger = dataService.getData('pointsLedger');
    return ledger
      .filter(entry => guideIds.includes(entry.user_id) && entry.points < 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(entry => {
        const guide = guideMap.get(entry.user_id);
        return {
          avatar: guide ? guide.name.split(' ').map(n => n[0]).join('') : 'U',
          agent: guide ? guide.name : 'Unknown Agent',
          reward: 'Points Redeemed', // Could be enhanced with actual reward names
          points: Math.abs(entry.points),
          date: entry.date.split('T')[0],
          status: 'claimed'
        };
      });
  }
}

module.exports = new ManagerReportingService();