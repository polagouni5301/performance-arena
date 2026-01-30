const roleService = require('../services/roleService');
const scoreService = require('../services/scoreService');
const dataService = require('../services/dataService');

class LeadershipController {
  // GET /api/leadership/overview
  async getOverview(req, res) {
    try {
      const roleData = roleService.getLeadershipData();

      const response = {
        kpis: {
          performanceScore: {
            value: "87.4",
            change: "+3.2%",
            changeType: "positive",
            subtitle: "Across 12 departments"
          },
          participationRate: {
            value: "94%",
            change: "+5%",
            changeType: "positive",
            subtitle: "1,247 of 1,326 active"
          },
          rewardsSpent: {
            value: "₹4.2L",
            subtitle: "of ₹5L budget",
            progress: 84
          },
          revenueUplift: {
            value: "+18%",
            badge: { label: "4.2x ROI", color: "success" },
            subtitle: "vs. pre-implementation"
          }
        },
        trendData: [
          { day: "Week 1", performance: 82, participation: 88 },
          { day: "Week 2", performance: 85, participation: 90 },
          { day: "Week 3", performance: 87, participation: 92 }
        ],
        topDepartments: [
          { name: "Enterprise Sales", revenue: "₹1.2Cr", progress: 100 }
        ],
        recentCampaigns: [
          { name: "Q4 Push Campaign", owner: "John D.", budgetUtil: 92, revenueImpact: "+₹45L", roiStatus: "Exceeding" }
        ],
        insights: [
          "Gamification increased agent retention by 23%",
          "Top performers earn 4.2x more rewards than average"
        ]
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/leadership/leaderboards
  async getLeaderboards(req, res) {
    try {
      const { timeRange = 'weekly', viewLevel = 'All Champions', rankBy = 'XP Earned' } = req.query;
      const guidesService = require('../services/guidesService');
      const allGuides = guidesService.getAllGuides();
      
      // Get unique departments
      const allDepartments = [...new Set(allGuides.map(g => g.department))].sort();
      
      // Calculate leaderboard from actual guide data
      const sortedGuides = allGuides.sort((a, b) => b.calculated.xp - a.calculated.xp);

      const response = {
        filters: {
          timeRanges: ["Weekly", "Monthly", "Quarterly"],
          viewLevels: ["All Champions", "By Department", "By Region"],
          rankByOptions: ["XP Earned", "Points", "Revenue Impact"]
        },
        currentWeek: "Jan 19 - Jan 25",
        monthStartDate: "Jan 1",
        allDepartments,
        levelTiers: [
          { name: "Master", minXP: 1500, color: "from-amber-400 to-orange-500", icon: "👑" },
          { name: "Elite", minXP: 1200, color: "from-primary to-pink-500", icon: "💎" },
          { name: "Expert", minXP: 900, color: "from-secondary to-blue-500", icon: "⚡" },
          { name: "Diamond", minXP: 500, color: "from-emerald-400 to-green-500", icon: "🌟" },
          { name: "Elite Master", minXP: 0, color: "from-slate-400 to-slate-600", icon: "🔰" }
        ],
        weeklyRewards: {
          top3: { points: 500, scratchCards: 3, xp: 100, badge: "Weekly Champion" },
          top10: { points: 250, scratchCards: 2, xp: 50 },
          top25Percent: { points: 100, scratchCards: 1, xp: 25 }
        },
        promotionRules: {
          promoted: { description: "Top 20% ascend to next tier" },
          safeZone: { description: "Next 25% maintain current rank" },
          demotionZone: { description: "Bottom tier risks descent" }
        },
        currentUser: {
          rank: 4,
          xp: 1350,
          level: "Elite",
          nextLevel: "Master",
          xpToNextLevel: 150,
          rankChange: "+2",
          weeklyXPGain: 250
        },
        leaderboard: sortedGuides.map((guide, index) => ({
          rank: index + 1,
          name: guide.name,
          avatar: guide.name.split(' ').map(n => n[0]).join(''),
          department: guide.department,
          region: "North",
          points: guide.calculated.points,
          xp: guide.calculated.xp,
          level: guide.calculated.xp > 1500 ? "Master" : guide.calculated.xp > 1200 ? "Elite" : guide.calculated.xp > 900 ? "Expert" : guide.calculated.xp > 500 ? "Diamond" : "Elite Master",
          revenue: `$${(guide.metrics.revenue || 0).toFixed(0)}`,
          nps: guide.metrics.nps || 0,
          aht: guide.metrics.aht || 0,
          qa: guide.metrics.qa || 0,
          trend: index < 5 ? "+2" : "0",
          trendType: index < 5 ? "up" : "neutral"
        }))
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/leadership/reports
  async getReports(req, res) {
    try {
      const { activeTab = 'Revenue' } = req.query;
      const kpiService = require('../services/kpiService');
      const kpiConfig = kpiService.getKPIConfig();

      // Build KPI metrics from actual config
      const kpiMetrics = Object.entries(kpiConfig).map(([key, config]) => ({
        label: config.name.toUpperCase(),
        value: key === 'aht' ? '18.5 min' : key === 'qa' ? '91.2%' : key === 'revenue' ? '$45K' : key === 'nps' ? '78' : config.target + ' ' + config.unit,
        change: '+4.5%',
        changeType: 'positive',
        icon: key === 'aht' ? 'Clock' : key === 'qa' ? 'Shield' : key === 'revenue' ? 'DollarSign' : 'ThumbsUp',
        sparkData: [85, 87, 88, 90, 91, 91, 92],
        teams: [
          { name: "T-A", value: "+3.2%", progress: 92 },
          { name: "T-B", value: "+1.8%", progress: 88 }
        ]
      }));

      const response = {
        revenueData: [
          { month: "JAN", revenue: 2.1 },
          { month: "FEB", revenue: 2.3 },
          { month: "MAR", revenue: 2.5 },
          { month: "APR", revenue: 2.7 },
          { month: "MAY", revenue: 2.8 },
          { month: "JUN", revenue: 2.7, milestone: "System Launch" }
        ],
        departmentRevenue: [
          { name: "Enterprise Sales", revenue: "₹1.2Cr", progress: 100, color: "from-primary to-secondary" },
          { name: "Support", revenue: "₹80L", progress: 85, color: "from-green-400 to-blue-500" }
        ],
        kpiMetrics
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // GET /api/leadership/roi
  async getROI(req, res) {
    try {
      const { fiscalYear } = req.query;
      const guidesService = require('../services/guidesService');
      const allGuides = guidesService.getAllGuides();
      
      // Calculate scatter data from actual guides - Points vs Revenue
      const scatterData = allGuides.slice(0, 20).map(guide => ({
        points: guide.calculated.points || 0,
        revenue: Math.round((guide.metrics.revenue || 0) * 100), // Scale up for visibility
        name: guide.name
      })).filter(d => d.points > 0 && d.revenue > 0);

      const response = {
        totalSpent: 420000,
        totalGain: 1780000,
        roiMultiplier: 4.24,
        correlationR2: 0.84,
        scatterData: scatterData.length > 0 ? scatterData : [
          { points: 5000, revenue: 120000, name: "Agent A" },
          { points: 3000, revenue: 80000, name: "Agent B" },
          { points: 8000, revenue: 180000, name: "Agent C" },
          { points: 2500, revenue: 60000, name: "Agent D" },
          { points: 6500, revenue: 150000, name: "Agent E" }
        ],
        quarterlyData: [
          { quarter: "Q1", spend: 95000, uplift: 380000 },
          { quarter: "Q2", spend: 105000, uplift: 420000 },
          { quarter: "Q3", spend: 110000, uplift: 480000 },
          { quarter: "Q4", spend: 110000, uplift: 500000 }
        ],
        contestROI: [
          { name: "Q4 Revenue Push", spend: "₹45K", revenue: "₹2.1L", roi: "4.7x", status: "Excellent" },
          { name: "Q3 Quality Sprint", spend: "₹32K", revenue: "₹1.4L", roi: "4.4x", status: "Excellent" },
          { name: "Q2 NPS Challenge", spend: "₹28K", revenue: "₹1.1L", roi: "3.9x", status: "Strong" }
        ]
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // POST /api/leadership/reports/export
  async exportReport(req, res) {
    try {
      const { format = 'PDF' } = req.body;
      // Mock export
      res.json({ exported: true, format, url: "https://example.com/report.pdf" });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }
}

module.exports = new LeadershipController();