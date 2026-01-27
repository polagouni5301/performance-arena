const roleService = require('../services/roleService');
const kpiService = require('../services/kpiService');
const dataService = require('../services/dataService');
const contestService = require('../services/contestService');

class AdminController {
  // GET /api/admin/overview
  async getOverview(req, res) {
    try {
      const users = dataService.getData('users');

      const response = {
        kpis: {
          activeUsers: {
            value: users.filter(u => u.status === 'active').length.toString(),
            change: "+12%",
            changeType: "positive"
          },
          activeContests: {
            value: "8",
            subtitle: "3 ending this week"
          },
          rewardsInStock: {
            value: "156",
            alert: "5 items low stock"
          },
          criticalWarnings: {
            value: "3",
            subtitle: "Requires attention"
          }
        },
        systemHealth: {
          status: "All Systems Operational",
          apiLatency: { value: "45ms", status: "Normal" },
          lastSync: { value: "2 min ago", status: "Synced", subtitle: "HRMS Integration" },
          errorRate: { value: "0.02%", status: "Healthy", progress: 2 }
        },
        lowStockAlerts: [
          { name: "Wireless Headphones", category: "Tech", stock: 3, status: "Critical", icon: "Headphones" }
        ],
        recentActivity: [
          { title: "New Contest Created", desc: "Q1 Revenue Sprint by Manager A", time: "10 min ago", icon: "Zap", color: "text-primary" }
        ]
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/admin/metrics
  async getMetrics(req, res) {
    try {
      const kpiConfig = kpiService.getKPIConfig();
      const guidesService = require('../services/guidesService');
      
      // Define all available metrics with proper icons and categories
      const metricDefinitions = {
        aht: { category: "Call Efficiency", icon: "Clock", color: "text-secondary", type: "Operational" },
        qa: { category: "Quality", icon: "CheckCircle", color: "text-success", type: "Operational" },
        revenue: { category: "Business", icon: "DollarSign", color: "text-accent", type: "Business" },
        nps: { category: "Customer Satisfaction", icon: "Star", color: "text-warning", type: "Business" },
        aos: { category: "Speed", icon: "Clock", color: "text-primary", type: "Operational" },
        nrpc: { category: "Revenue", icon: "DollarSign", color: "text-success", type: "Business" },
        nconv_pct: { category: "Conversion", icon: "TrendingUp", color: "text-primary", type: "Business" },
        qa_score: { category: "Quality", icon: "Shield", color: "text-secondary", type: "Operational" }
      };

      const metrics = Object.keys(kpiConfig).map((key, idx) => ({
        id: key,
        name: kpiConfig[key].name,
        category: metricDefinitions[key]?.category || "General",
        icon: metricDefinitions[key]?.icon || "Target",
        color: metricDefinitions[key]?.color || "text-muted-foreground",
        target: kpiConfig[key].type === 'lower_better' 
          ? `≤ ${kpiConfig[key].target} ${kpiConfig[key].unit}` 
          : `≥ ${kpiConfig[key].target} ${kpiConfig[key].unit}`,
        weightage: kpiConfig[key].weightage,
        cap: `${kpiConfig[key].maxPoints} pts max`,
        type: metricDefinitions[key]?.type || "Operational",
        status: kpiConfig[key].weightage > 0 ? "Enabled" : "Disabled"
      }));

      // Calculate summary
      const enabledMetrics = metrics.filter(m => m.status === "Enabled");
      const operationalCount = enabledMetrics.filter(m => m.type === "Operational").length;
      const businessCount = enabledMetrics.filter(m => m.type === "Business").length;

      const response = {
        summary: {
          totalWeightage: enabledMetrics.reduce((sum, m) => sum + m.weightage, 0),
          activeKPIs: enabledMetrics.length,
          operationalCount,
          businessCount
        },
        metrics
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/admin/points-rules
  async getPointsRules(req, res) {
    try {
      const kpiConfig = kpiService.getKPIConfig();

      const response = {
        kpiWeightage: Object.keys(kpiConfig).map(key => ({ id: key, value: kpiConfig[key].weightage })),
        tierMultipliers: {
          topTier: { label: "Top 10%", multiplier: 1.5 },
          midTier: { label: "Top 50%", multiplier: 1.0 },
          standard: { label: "Baseline", multiplier: 0.8 }
        },
        rewardProbability: [
          { id: "mega", name: "Mega Reward", probability: 5 },
          { id: "rare", name: "Rare Bonus", probability: 25 },
          { id: "common", name: "Common Ticket", probability: 70 }
        ],
        globalCaps: {
          daily: { enabled: true, value: 5000 },
          weekly: { enabled: true, value: 25000 },
          monthly: { enabled: false, value: null }
        },
        systemStatus: {
          rulesActive: true,
          lastUpdated: "Jan 23, 2024",
          version: "v2.4"
        }
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/admin/rewards-catalog
  async getRewardsCatalog(req, res) {
    try {
      const { category, status, page = 1, search } = req.query;
      const rewards = dataService.getData('rewardsCatalog');

      const filtered = rewards.filter(reward => {
        if (category && category !== 'All Categories' && reward.category !== category) return false;
        if (status && status !== 'All Statuses' && reward.status !== status) return false;
        if (search && !reward.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });

      const perPage = 10;
      const start = (page - 1) * perPage;
      const paginated = filtered.slice(start, start + perPage);

      const response = {
        categories: ["All Categories", "Voucher", "Merchandise", "Perk", "Experience"],
        statuses: ["All Statuses", "Active", "Low Stock", "Out of Stock"],
        pagination: {
          page: parseInt(page),
          perPage,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / perPage)
        },
        rewards: paginated.map(reward => ({
          id: reward.reward_id,
          name: reward.name,
          category: reward.category,
          pointCost: reward.point_cost,
          stock: reward.stock,
          status: reward.stock === 'Unlimited' || reward.stock > 10 ? 'Active' : 'Low Stock',
          icon: reward.icon,
          image: reward.image,
          eligibility: reward.eligibility
        }))
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/admin/audit-logs
  async getAuditLogs(req, res) {
    try {
      const { search, page = 1, dateFrom, dateTo } = req.query;
      const guidesService = require('../services/guidesService');
      const allGuides = guidesService.getAllGuides();
      
      // Generate claim logs from actual guides
      const claimLogs = allGuides.slice(0, 20).map((guide, index) => ({
        date: new Date(Date.now() - (index * 3600000 * 24)).toLocaleString(),
        initials: guide.name.split(' ').map(n => n[0]).join(''),
        agent: guide.name,
        reward: index % 3 === 0 ? "Gift Card $50" : index % 3 === 1 ? "Points Bonus" : "Scratch Card",
        points: Math.round(guide.calculated.points * 0.1),
        status: index % 4 === 0 ? "Pending Approval" : index % 4 === 1 ? "Fulfilled" : index % 4 === 2 ? "Shipped" : "Fulfilled",
        color: ["bg-primary", "bg-green-500", "bg-secondary", "bg-accent"][index % 4]
      }));

      // Filter based on search
      const filteredLogs = search 
        ? claimLogs.filter(log => 
            log.agent.toLowerCase().includes(search.toLowerCase()) ||
            log.reward.toLowerCase().includes(search.toLowerCase())
          )
        : claimLogs;

      const perPage = 10;
      const start = (parseInt(page) - 1) * perPage;
      const paginated = filteredLogs.slice(start, start + perPage);

      const response = {
        pagination: {
          showing: `${start + 1}-${Math.min(start + perPage, filteredLogs.length)}`,
          total: filteredLogs.length
        },
        claimLogs: paginated,
        emailTriggers: [
          { name: "Low Stock Alert", desc: "Notify when item stock < 10", enabled: true },
          { name: "Claim Approval", desc: "Manager approval for claims > 5000 pts", enabled: true },
          { name: "Contest Start", desc: "Notify participants when contest begins", enabled: true },
          { name: "Weekly Summary", desc: "Send weekly performance summary", enabled: false }
        ],
        downloadReports: [
          { name: "Monthly Summary", desc: "Full audit trail for current month", icon: "Calendar" },
          { name: "Claims Report", desc: "All reward claims with status", icon: "FileText" },
          { name: "Points Ledger", desc: "Complete points transaction history", icon: "Database" }
        ]
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/admin/metrics
  async createMetric(req, res) {
    try {
      const metricData = req.body;
      // Mock creation
      res.status(201).json({ id: `metric_${Date.now()}`, ...metricData });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // PUT /api/admin/metrics/{metricId}
  async updateMetric(req, res) {
    try {
      const { metricId } = req.params;
      const updates = req.body;
      // Mock update
      res.json({ id: metricId, ...updates, updated: true });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // DELETE /api/admin/metrics/{metricId}
  async deleteMetric(req, res) {
    try {
      const { metricId } = req.params;
      // Mock deletion
      res.json({ deleted: true, metricId });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // PUT /api/admin/points-rules
  async updatePointsRules(req, res) {
    try {
      const rules = req.body;
      // Mock update
      res.json({ ...rules, updated: true });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/admin/points-rules/simulate
  async simulatePointsRules(req, res) {
    try {
      const testData = req.body;
      // Mock simulation
      res.json({ simulationResult: "Rules applied successfully", sampleOutput: { score: 95 } });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/admin/rewards-catalog
  async createReward(req, res) {
    try {
      const rewardData = req.body;
      // Mock creation
      res.status(201).json({ id: `RWD-${Date.now()}`, ...rewardData });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // PUT /api/admin/rewards-catalog/{rewardId}
  async updateReward(req, res) {
    try {
      const { rewardId } = req.params;
      const updates = req.body;
      // Mock update
      res.json({ id: rewardId, ...updates, updated: true });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // DELETE /api/admin/rewards-catalog/{rewardId}
  async deleteReward(req, res) {
    try {
      const { rewardId } = req.params;
      // Mock deletion
      res.json({ deleted: true, rewardId });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // PATCH /api/admin/rewards-catalog/{rewardId}/stock
  async updateStock(req, res) {
    try {
      const { rewardId } = req.params;
      const { stock } = req.body;
      // Mock update
      res.json({ id: rewardId, stock, updated: true });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // PATCH /api/admin/audit-logs/triggers/{triggerName}
  async toggleEmailTrigger(req, res) {
    try {
      const { triggerName } = req.params;
      const { enabled } = req.body;
      // Mock toggle
      res.json({ triggerName, enabled, updated: true });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/admin/audit-logs/export/{reportType}
  async exportAuditReport(req, res) {
    try {
      const { reportType } = req.params;
      // Mock export
      res.json({ exported: true, reportType, url: "https://example.com/audit-report.pdf" });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/admin/contests
  async getContests(req, res) {
    try {
      const contests = contestService.getContests();
      const adminContests = contests.filter(c => c.createdByRole === 'admin');
      
      const now = new Date();
      const active = adminContests.filter(c => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        return c.status === 'published' && start <= now && end >= now;
      });
      
      const upcoming = adminContests.filter(c => {
        const start = new Date(c.startDate);
        return c.status === 'published' && start > now;
      });
      
      const completed = adminContests.filter(c => {
        const end = new Date(c.endDate);
        return c.status === 'published' && end < now;
      });
      
      const drafts = adminContests.filter(c => c.status === 'draft');
      
      res.json({
        contests: adminContests,
        summary: {
          total: adminContests.length,
          active: active.length,
          upcoming: upcoming.length,
          completed: completed.length,
          drafts: drafts.length
        },
        activeContests: active,
        upcomingContests: upcoming,
        completedContests: completed,
        draftContests: drafts
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/admin/contests
  async createContest(req, res) {
    try {
      const contestData = req.body;
      const creatorId = req.body.creatorId || 'admin-1';
      const creatorName = req.body.creatorName || 'Admin';
      
      const newContest = contestService.createContest(
        contestData,
        creatorId,
        'admin',
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

  // PUT /api/admin/contests/:contestId
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

  // DELETE /api/admin/contests/:contestId
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

  // POST /api/admin/contests/:contestId/publish
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

  // GET /api/admin/contests/active
  async getActiveContests(req, res) {
    try {
      const active = contestService.getActiveContests();
      res.json({ contests: active });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }
}

module.exports = new AdminController();