
export const leadershipOverviewMock = {
  kpis: {
    performanceScore: { value: "8.4", change: "+2.4%", changeType: "positive", subtitle: "vs. previous 30 days" },
    participationRate: { value: "87%", change: "↑ 12%", changeType: "positive", subtitle: "Active engagement" },
    rewardsSpent: { value: "₹2.85L", subtitle: "/ ₹3L Budget", progress: 95 },
    revenueUplift: { value: "₹1.2Cr", badge: { label: "ROI Positive", color: "success" }, subtitle: "Attributed impact" },
  },
  trendData: [
    { day: "Day 1", performance: 72, participation: 65 },
    { day: "Day 15", performance: 68, participation: 70 },
    { day: "Day 30", performance: 75, participation: 78 },
    { day: "Day 45", performance: 82, participation: 85 },
    { day: "Day 60", performance: 79, participation: 88 },
    { day: "Day 75", performance: 85, participation: 92 },
    { day: "Day 90", performance: 88, participation: 95 },
  ],
  topDepartments: [
    { name: "Mid-Market Sales", revenue: "₹37.5L", progress: 100 },
    { name: "Enterprise SDRs", revenue: "₹17.5L", progress: 46 },
    { name: "Customer Success", revenue: "₹15.4L", progress: 41 },
    { name: "Renewal Team", revenue: "₹10L", progress: 26 },
    { name: "Support Services", revenue: "₹5.8L", progress: 15 },
  ],
  recentCampaigns: [
    { name: "Q3 Closing Sprint", owner: "Sales Leadership", budgetUtil: 98, revenueImpact: "₹6.6L", roiStatus: "Exceeding" },
    { name: "NPS Challenge", owner: "Customer Success", budgetUtil: 85, revenueImpact: "₹2.4L", roiStatus: "On Track" },
    { name: "AHT Reduction", owner: "Operations", budgetUtil: 72, revenueImpact: "₹1.8L", roiStatus: "On Track" },
  ],
  insights: [
    "Participation increased by 12% this month.",
    "ROI remains steady at 4.2x multiplier.",
    "Mid-Market sales driving 38% of total uplift.",
  ],
};

export const leadershipLeaderboardsMock = {
  filters: {
    timeRanges: ["Weekly", "Monthly", "All-Time"],
    viewLevels: ["All Champions", "By Level", "By Department"],
    rankByOptions: ["XP Earned", "Revenue Impact", "NPS Score", "Win Streak"],
    levels: ["All Levels", "Rookie", "Challenger", "Warrior", "Champion", "Legend"],
  },
  lastUpdated: "Today, 09:41 AM",
  currentWeek: "Jan 19 - Jan 25, 2026",
  monthStartDate: "Jan 1, 2026",
  
  // XP-based level tiers (10 points = 1 XP)
  levelTiers: [
    { name: "Legend", minXP: 2000, icon: "👑", color: "from-amber-400 to-orange-500", glowColor: "amber" },
    { name: "Champion", minXP: 1500, icon: "💎", color: "from-purple-500 to-pink-500", glowColor: "purple" },
    { name: "Warrior", minXP: 1000, icon: "⚔️", color: "from-cyan-400 to-blue-500", glowColor: "cyan" },
    { name: "Challenger", minXP: 500, icon: "🌟", color: "from-emerald-400 to-green-500", glowColor: "emerald" },
    { name: "Rookie", minXP: 0, icon: "🔰", color: "from-gray-400 to-slate-500", glowColor: "gray" },
  ],

  // Current week rewards for top performers
  weeklyRewards: {
    top3: { xp: 50, points: 500, scratchCards: 3, badge: "Weekly MVP" },
    top10: { xp: 25, points: 250, scratchCards: 2, badge: null },
    top25Percent: { xp: 10, points: 100, scratchCards: 1, badge: null },
  },

  // Promotion/Demotion zones
  promotionRules: {
    promoted: { percentage: 20, description: "Top 20% promoted to next level" },
    safeZone: { percentage: 25, description: "Next 25% maintain their level" },
    demotionZone: { percentage: 55, description: "Rest face demotion to lower level" },
  },

  // 20 dummy leaderboard entries with XP-based ranking
  leaderboard: [
    { rank: 1, name: "Sarah Jenkins", department: "Enterprise Sales", region: "North America", points: 24500, xp: 2450, revenue: "₹40.2L", nps: 9.8, trend: "+18%", trendType: "up", level: "Legend", streak: 12, avatar: "S", isCurrentUser: false },
    { rank: 2, name: "Michael Chen", department: "Mid-Market", region: "EMEA", points: 21200, xp: 2120, revenue: "₹36.3L", nps: 9.5, trend: "+15%", trendType: "up", level: "Legend", streak: 10, avatar: "M", isCurrentUser: false },
    { rank: 3, name: "Jessica Wu", department: "Customer Success", region: "APAC", points: 19800, xp: 1980, revenue: "₹32.2L", nps: 9.2, trend: "+12%", trendType: "up", level: "Champion", streak: 8, avatar: "J", isCurrentUser: false },
    { rank: 4, name: "David Miller", department: "Enterprise Sales", region: "North America", points: 17500, xp: 1750, revenue: "₹28.5L", nps: 9.0, trend: "+8%", trendType: "up", level: "Champion", streak: 6, avatar: "D", isCurrentUser: false },
    { rank: 5, name: "Emily Davis", department: "SDR Team", region: "Remote", points: 16200, xp: 1620, revenue: "₹25.9L", nps: 8.9, trend: "+5%", trendType: "up", level: "Champion", streak: 5, avatar: "E", isCurrentUser: false },
    { rank: 6, name: "James Wilson", department: "Mid-Market", region: "LATAM", points: 14800, xp: 1480, revenue: "₹22.8L", nps: 8.7, trend: "+4%", trendType: "up", level: "Warrior", streak: 4, avatar: "Ja", isCurrentUser: false },
    { rank: 7, name: "Patricia Garcia", department: "Customer Success", region: "EMEA", points: 13500, xp: 1350, revenue: "₹20.0L", nps: 9.3, trend: "+10%", trendType: "up", level: "Warrior", streak: 7, avatar: "P", isCurrentUser: false },
    { rank: 8, name: "Robert Martinez", department: "Enterprise Sales", region: "APAC", points: 12800, xp: 1280, revenue: "₹18.8L", nps: 8.5, trend: "+3%", trendType: "up", level: "Warrior", streak: 3, avatar: "R", isCurrentUser: false },
    { rank: 9, name: "Linda Taylor", department: "SMB Sales", region: "North America", points: 11400, xp: 1140, revenue: "₹16.9L", nps: 8.8, trend: "+2%", trendType: "up", level: "Warrior", streak: 5, avatar: "L", isCurrentUser: false },
    { rank: 10, name: "Thomas Brown", department: "Renewal Team", region: "EMEA", points: 10500, xp: 1050, revenue: "₹15.5L", nps: 8.4, trend: "0%", trendType: "neutral", level: "Warrior", streak: 2, avatar: "T", isCurrentUser: false },
    { rank: 11, name: "You", department: "Strategic Accounts", region: "APAC", points: 9800, xp: 980, revenue: "₹14.2L", nps: 8.6, trend: "+7%", trendType: "up", level: "Challenger", streak: 4, avatar: "Y", isCurrentUser: true },
    { rank: 12, name: "Christopher Lee", department: "Mid-Market", region: "North America", points: 8900, xp: 890, revenue: "₹12.8L", nps: 8.2, trend: "+1%", trendType: "up", level: "Challenger", streak: 3, avatar: "C", isCurrentUser: false },
    { rank: 13, name: "Barbara Harris", department: "SDR Team", region: "EMEA", points: 8200, xp: 820, revenue: "₹11.5L", nps: 8.0, trend: "-1%", trendType: "down", level: "Challenger", streak: 2, avatar: "B", isCurrentUser: false },
    { rank: 14, name: "Daniel Clark", department: "Customer Success", region: "LATAM", points: 7500, xp: 750, revenue: "₹10.2L", nps: 7.9, trend: "+4%", trendType: "up", level: "Challenger", streak: 4, avatar: "Da", isCurrentUser: false },
    { rank: 15, name: "Nancy Lewis", department: "Enterprise Sales", region: "APAC", points: 6800, xp: 680, revenue: "₹9.0L", nps: 8.1, trend: "-2%", trendType: "down", level: "Challenger", streak: 1, avatar: "N", isCurrentUser: false },
    { rank: 16, name: "Mark Robinson", department: "Renewal Team", region: "North America", points: 5900, xp: 590, revenue: "₹7.8L", nps: 7.5, trend: "+3%", trendType: "up", level: "Challenger", streak: 2, avatar: "Ma", isCurrentUser: false },
    { rank: 17, name: "Sandra Walker", department: "SMB Sales", region: "EMEA", points: 4800, xp: 480, revenue: "₹6.2L", nps: 7.8, trend: "-3%", trendType: "down", level: "Rookie", streak: 0, avatar: "Sa", isCurrentUser: false },
    { rank: 18, name: "Kevin Hall", department: "SDR Team", region: "Remote", points: 3900, xp: 390, revenue: "₹4.8L", nps: 7.2, trend: "+2%", trendType: "up", level: "Rookie", streak: 1, avatar: "K", isCurrentUser: false },
    { rank: 19, name: "Elizabeth Allen", department: "Customer Success", region: "LATAM", points: 2800, xp: 280, revenue: "₹3.2L", nps: 7.0, trend: "-4%", trendType: "down", level: "Rookie", streak: 0, avatar: "El", isCurrentUser: false },
    { rank: 20, name: "George Young", department: "Mid-Market", region: "APAC", points: 1500, xp: 150, revenue: "₹1.8L", nps: 6.8, trend: "-5%", trendType: "down", level: "Rookie", streak: 0, avatar: "G", isCurrentUser: false },
  ],

  // Current user stats
  currentUser: {
    rank: 11,
    name: "You",
    xp: 980,
    points: 9800,
    level: "Challenger",
    nextLevel: "Warrior",
    xpToNextLevel: 20,
    rankChange: "+3",
    weeklyXPGain: 120,
    isInPromotionZone: false,
    isInSafeZone: true,
    isInDemotionZone: false,
  },
};

export const leadershipReportsMock = {
  activeTab: "Revenue",
  reportTabs: ["Revenue", "Efficiency", "Culture"],
  revenueData: [
    { month: "JAN", revenue: 2.0 },
    { month: "FEB", revenue: 2.1 },
    { month: "MAR", revenue: 2.2 },
    { month: "APR", revenue: 2.3 },
    { month: "MAY", revenue: 2.4 },
    { month: "JUN", revenue: 2.7 },
    { month: "JUL", revenue: 3.0 },
    { month: "AUG", revenue: 3.2 },
    { month: "SEP", revenue: 3.3 },
    { month: "OCT", revenue: 3.4 },
    { month: "NOV", revenue: 3.5 },
    { month: "DEC", revenue: 3.6 },
  ],
  departmentRevenue: [
    { name: "Enterprise", revenue: "₹1.21Cr", progress: 100, color: "from-primary to-pink-500" },
    { name: "Customer Success", revenue: "₹70.8L", progress: 58, color: "from-amber-500 to-yellow-500" },
    { name: "SMB Sales", revenue: "₹26.7L", progress: 22, color: "from-secondary to-blue-500" },
    { name: "Partnerships", revenue: "₹15L", progress: 12, color: "from-success to-emerald-400" },
  ],
  kpiMetrics: [
    {
      label: "QUALITY ASSURANCE", value: "98.5%", change: "↑ 12%", changeType: "positive",
      icon: "Shield",
      sparkData: [65, 70, 72, 78, 82, 88, 92, 95, 98],
      teams: [
        { name: "ENT", value: "+2.1%", progress: 85 },
        { name: "CS", value: "+0.5%", progress: 78 },
        { name: "SMB", value: "-1.2%", progress: 45 },
      ],
    },
    {
      label: "AVG HANDLE TIME", value: "4m 12s", change: "↓ 2m", changeType: "positive",
      icon: "Clock",
      sparkData: [100, 95, 88, 82, 78, 72, 68, 65, 62],
      teams: [
        { name: "ENT", value: "-30s", progress: 70 },
        { name: "CS", value: "+10s", progress: 50 },
        { name: "SMB", value: "-15s", progress: 60 },
      ],
    },
    {
      label: "NPS SCORE", value: "72", change: "↑ 24", changeType: "positive",
      icon: "ThumbsUp",
      sparkData: [48, 52, 55, 58, 62, 65, 68, 70, 72],
      teams: [
        { name: "ENT", value: "+10", progress: 90 },
        { name: "CS", value: "+5", progress: 75 },
        { name: "SMB", value: "-8", progress: 35 },
      ],
    },
  ],
  systemLaunchDate: "JUN",
  growthPostLaunch: 32,
};

export const leadershipROIMock = {
  totalSpent: 285400,
  totalGain: 1455540,
  roiMultiplier: 5.1,
  scatterData: [
    { points: 1000, revenue: 15000 },
    { points: 2000, revenue: 25000 },
    { points: 3000, revenue: 45000 },
    { points: 4000, revenue: 55000 },
    { points: 5000, revenue: 85000 },
    { points: 6000, revenue: 110000 },
    { points: 7000, revenue: 125000 },
    { points: 8000, revenue: 145000 },
    { points: 9000, revenue: 175000 },
    { points: 10000, revenue: 195000 },
    { points: 11000, revenue: 220000 },
    { points: 12000, revenue: 260000 },
  ],
  quarterlyData: [
    { quarter: "Q1", spend: 45000, uplift: 180000 },
    { quarter: "Q2", spend: 62000, uplift: 320000 },
    { quarter: "Q3", spend: 78000, uplift: 455000 },
    { quarter: "Q4", spend: 100000, uplift: 500000 },
  ],
  contestROI: [
    { name: "Q3 Closing Sprint", spend: "₹50,000", revenue: "₹4.2L", roi: "8.4x", status: "Excellent" },
    { name: "NPS Champion Challenge", spend: "₹35,000", revenue: "₹1.8L", roi: "5.1x", status: "Strong" },
    { name: "AHT Reduction Race", spend: "₹28,000", revenue: "₹1.2L", roi: "4.3x", status: "Strong" },
    { name: "New Hire Accelerator", spend: "₹45,000", revenue: "₹1.5L", roi: "3.3x", status: "Good" },
    { name: "Weekend Warriors", spend: "₹22,000", revenue: "₹66,000", roi: "3.0x", status: "Good" },
    { name: "Quality Quest", spend: "₹40,000", revenue: "₹1.0L", roi: "2.5x", status: "Average" },
  ],
  correlationR2: 0.84,
  fiscalYear: "FY2024",
  lastUpdated: "Today, 09:00 AM",
};
