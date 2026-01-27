const roleService = require('../services/roleService');
const scoreService = require('../services/scoreService');
const dataService = require('../services/dataService');
const managerReportingService = require('../services/managerReportingService');
const managerUtilService = require('../services/managerUtilService');
const userService = require('../services/userService');
const contestService = require('../services/contestService');

class ManagerController {
  // GET /api/manager/{managerId}/overview
  async getOverview(req, res) {
    try {
      const { managerId } = req.params;

      // Find the manager user using utility service
      const managerUser = managerUtilService.findManagerById(managerId);
      if (!managerUser) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Manager not found' } });
      }

      const managerName = managerUser.name;

      // Get complete overview data from utility service
      const overviewData = managerUtilService.getOverviewData(managerId, managerName);
      
      // Add live feed with actual guide data
      overviewData.liveFeed = managerUtilService.getLiveFeed(managerName);

      res.json(overviewData);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/manager/{managerId}/team-performance
  async getTeamPerformance(req, res) {
    try {
      const { managerId } = req.params;

      // Find the manager user to get their name
      const managerUser = managerUtilService.findManagerById(managerId);
      if (!managerUser) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Manager not found' } });
      }

      const managerName = managerUser.name;

      // Get team performance data from utility service
      const performanceData = managerUtilService.getTeamPerformanceData(managerName);

      res.json(performanceData);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/manager/{managerId}/contests
  async getContests(req, res) {
    try {
      const { managerId } = req.params;

      // Find the manager user
      const managerUser = managerUtilService.findManagerById(managerId);
      if (!managerUser) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Manager not found' } });
      }

      const managerName = managerUser.name;
      const guides = managerUtilService.getManagerReportingGuides(managerName);
      
      // Create contests based on top performers
      const topRevenueGuides = guides
        .sort((a, b) => (b.metrics.revenue || 0) - (a.metrics.revenue || 0))
        .slice(0, 5);
      
      const topQAGuides = guides
        .sort((a, b) => (b.metrics.qa || 0) - (a.metrics.qa || 0))
        .slice(0, 5);
      
      const totalRevenue = guides.reduce((sum, g) => sum + (g.metrics.revenue || 0), 0);
      
      // Build live feed from actual guide data
      const liveFeed = guides
        .filter(g => g.metrics.revenue > 0)
        .sort((a, b) => (b.metrics.revenue || 0) - (a.metrics.revenue || 0))
        .slice(0, 3)
        .map(g => ({
          avatar: g.name.split(' ').map(n => n[0]).join(''),
          name: g.name,
          action: `achieved $${(g.metrics.revenue || 0).toFixed(2)}`,
          time: "just now"
        }));

      const response = {
        activeContests: [
          {
            id: 1,
            name: "Q1 Revenue Sprint",
            status: "live",
            objective: "Maximize team revenue",
            progress: Math.round((totalRevenue / 50000) * 100),
            target: 50000,
            current: Math.round(totalRevenue),
            timeRemaining: "2d 14h",
            participants: guides.length,
            topParticipants: topRevenueGuides.map(g => ({ name: g.name, revenue: g.metrics.revenue || 0 }))
          },
          {
            id: 2,
            name: "Quality Week",
            status: "upcoming",
            objective: "Improve QA scores",
            scheduledStart: "Jan 28, 9:00 AM",
            participants: guides.length,
            topParticipants: topQAGuides.map(g => ({ name: g.name, qa: g.metrics.qa || 0 }))
          }
        ],
        pastContests: [
          {
            name: "December Blitz",
            dates: "Dec 1-15",
            winner: guides.length > 0 ? guides[0].name : "N/A",
            winnerAvatar: guides.length > 0 ? guides[0].name.split(' ').map(n => n[0]).join('') : "NA",
            reward: 500.00,
            impact: "+12% Revenue"
          }
        ],
        liveFeed: liveFeed.length > 0 ? liveFeed : [
          { avatar: "SJ", name: "No activity", action: "yet", time: "awaiting" }
        ],
        tip: "Shorter sprints (3-5 days) often yield 2x engagement vs monthly ones."
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/manager/{managerId}/rewards-audit
  async getRewardsAudit(req, res) {
    try {
      const { managerId } = req.params;

      // Find the manager user to get their name
      const managerUser = managerUtilService.findManagerById(managerId);
      if (!managerUser) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Manager not found' } });
      }

      const managerName = managerUser.name;

      // Get rewards audit data from utility service
      const auditData = managerUtilService.getRewardsAuditData(managerName);

      res.json(auditData);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/manager/contests
  async createContest(req, res) {
    try {
      const contestData = req.body;
      const creatorId = req.body.creatorId || 'manager-1';
      const creatorName = req.body.creatorName || 'Manager';
      
      const newContest = contestService.createContest(
        contestData,
        creatorId,
        'manager',
        creatorName
      );
      
      res.status(201).json({ 
        success: true, 
        message: 'Contest created successfully!',
        contest: newContest 
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // PUT /api/manager/contests/{contestId}
  async updateContest(req, res) {
    try {
      const { contestId } = req.params;
      const updates = req.body;
      
      const updated = contestService.updateContest(contestId, updates);
      
      if (!updated) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contest not found' } });
      }
      
      res.json({ success: true, contest: updated });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // DELETE /api/manager/contests/{contestId}
  async deleteContest(req, res) {
    try {
      const { contestId } = req.params;
      
      const deleted = contestService.deleteContest(contestId);
      
      if (!deleted) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contest not found' } });
      }
      
      res.json({ success: true, deleted: true });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/manager/contests/:contestId/publish
  async publishContest(req, res) {
    try {
      const { contestId } = req.params;
      
      const published = contestService.publishContest(contestId);
      
      if (!published) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contest not found' } });
      }
      
      res.json({ 
        success: true, 
        message: 'Contest published successfully!',
        contest: published 
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Helper methods
  getWeeklyData() {
    return managerUtilService.getWeeklyData();
  }

  getLiveFeed() {
    return managerUtilService.getLiveFeed();
  }
}

module.exports = new ManagerController();