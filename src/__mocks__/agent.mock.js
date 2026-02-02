
import { Medal, Star, Flame, Target, Trophy, Zap, Crown, Shield, Award, Lock, Sparkles, TrendingUp } from "lucide-react";
export const agentDashboardMock = {
  score: 88,
  xp: 1250,
  xpToday: 150, 
  streak: 5,
  personalBest: 12,
  percentile: 95,
  ranking: "Top 5%",
  spinUnlockProgress: 90,
  spinUnlocked: false,
  callsToUnlock: 2,
  leaderboard: [
    { rank: 1, name: "Sarah", points: 2400, avatar: "S", color: "from-yellow-400 to-amber-500" },
    { rank: 2, name: "Mike", points: 2150, avatar: "M", color: "from-gray-300 to-gray-400" },
    { rank: 3, name: "Jessica", points: 1980, avatar: "J", color: "from-amber-600 to-amber-700" },
  ],
  currentUser: {
    rank: 4,
    name: "You",
    points: 1250,
    avatar: "A",
  },
  metrics: [
    { key: "aht", title: "AHT", value: "4m 30s", target: "5m Goal", status: "excellent", statusLabel: "Excellent", progress: 90 },
    { key: "qa", title: "QA Score", value: "98%", target: "90% Goal", status: "excellent", statusLabel: "Excellent", progress: 100 },
    { key: "revenue", title: "Revenue", value: "$450", target: "$500 Goal", status: "on-track", statusLabel: "On Track", progress: 90 },
    { key: "nps", title: "NPS", value: "75", target: "60 Goal", status: "excellent", statusLabel: "Superb", progress: 100 },
  ],
  scratchCardAvailable: true,
};

export const agentPerformanceMock = {
  agent: {
    id: "agent-001",
    name: "Sarah Jenkins",
    avatar: "S",
    rank: "Diamond Agent",
    team: "Team Alpha",
    percentile: 95,
  },
  weeklyData: [
    { day: "MON", points: 800, target: 1000, team: 750 },
    { day: "TUE", points: 1100, target: 1000, team: 900 },
    { day: "WED", points: 1350, target: 1000, team: 1100 },
    { day: "THU", points: 1600, target: 1000, team: 1250 },
    { day: "FRI", points: 1900, target: 1000, team: 1400 },
    { day: "SAT", points: 2100, target: 1000, team: 1550 },
    { day: "SUN", points: 2400, target: 1000, team: 1700 },
  ],
  metrics: [
    { key: "qa", title: "QA Score", value: 98, suffix: "%", change: "+2%", status: "excellent", statusLabel: "Excellent", progress: 100, target: "Target: 95%", color: "emerald" },
    { key: "revenue", title: "Revenue", value: 12.4, prefix: "$", suffix: "k", target: "Target: $12k", status: "on-track", statusLabel: "On Track", progress: 103, color: "cyan" },
    { key: "aht", title: "AHT", value: "4:12", change: "+15s", status: "at-risk", statusLabel: "At Risk", progress: 85, target: "Target: 4:00", color: "amber" },
    { key: "nps", title: "NPS", value: 42, change: "-8 pts", status: "critical", statusLabel: "Critical", progress: 70, target: "Target: 50", color: "rose" },
  ],
  pointsLog: [
    { metric: "QA Score", points: "+150", time: "2 hours ago", type: "positive", category: "QA" },
    { metric: "Revenue Target Hit", points: "+200", time: "3 hours ago", type: "positive", category: "Revenue" },
    { metric: "AHT Exceeded", points: "-50", time: "4 hours ago", type: "negative", category: "AHT" },
    { metric: "Customer Satisfaction", points: "+100", time: "5 hours ago", type: "positive", category: "NPS" },
    { metric: "First Call Resolution", points: "+75", time: "6 hours ago", type: "positive", category: "QA" },
  ],
};

export const agentLeaderboardMock = {
  topThree: [
    { rank: 1, name: "Sarah Jenkins", xp: 1540, points: 15400, team: "Team Alpha", avatar: "S", badge: "GOLD", level: "Master" },
    { rank: 2, name: "Mike Ross", xp: 1420, points: 14200, team: "Legal Eagles", avatar: "M", badge: "SILVER", level: "Elite" },
    { rank: 3, name: "Jessica Pearson", xp: 1390, points: 13900, team: "Corporate", avatar: "J", badge: "BRONZE", level: "Elite" },
  ],
  leaderboard: [
    { rank: 4, name: "Harvey Specter", xp: 1385, points: 13850, team: "Legal Eagles", gap: 5, trend: "up", avatar: "H", level: "Elite" },
    { rank: 5, name: "Louis Litt", xp: 1320, points: 13200, team: "Corporate", gap: 65, trend: "down", avatar: "L", level: "Elite" },
    { rank: 6, name: "Donna Paulsen", xp: 1285, points: 12850, team: "Admin Ops", gap: 35, trend: "up", avatar: "D", level: "Elite" },
    { rank: 7, name: "Rachel Zane", xp: 1240, points: 12400, team: "Paralegals", gap: 45, trend: "same", avatar: "R", level: "Elite" },
    { rank: 8, name: "Katrina Bennett", xp: 1180, points: 11800, team: "Corporate", gap: 60, trend: "up", avatar: "K", level: "Expert" },
    { rank: 9, name: "Alex Williams", xp: 1120, points: 11200, team: "Tech Ops", gap: 60, trend: "up", avatar: "A", level: "Expert" },
    { rank: 10, name: "Brian Johnson", xp: 1085, points: 10850, team: "Sales Force", gap: 35, trend: "same", avatar: "B", level: "Expert" },
    { rank: 11, name: "Diana Chen", xp: 1050, points: 10500, team: "Analytics", gap: 35, trend: "down", avatar: "D", level: "Expert" },
    { rank: 12, name: "Eric Foster", xp: 1020, points: 10200, team: "Innovators", gap: 30, trend: "up", avatar: "E", level: "Expert" },
    { rank: 13, name: "Fiona Garcia", xp: 985, points: 9850, team: "Support", gap: 35, trend: "same", avatar: "F", level: "Expert" },
    { rank: 14, name: "George Hall", xp: 945, points: 9450, team: "Operations", gap: 40, trend: "down", avatar: "G", level: "Expert" },
    { rank: 15, name: "Hannah Irwin", xp: 910, points: 9100, team: "Marketing", gap: 35, trend: "up", avatar: "H", level: "Expert" },
    { rank: 16, name: "Ian Jackson", xp: 875, points: 8750, team: "Sales Force", gap: 35, trend: "same", avatar: "I", level: "Intermediate" },
    { rank: 17, name: "Julia Kim", xp: 840, points: 8400, team: "Analytics", gap: 35, trend: "up", avatar: "J", level: "Intermediate" },
    { rank: 18, name: "Kevin Lee", xp: 805, points: 8050, team: "Tech Ops", gap: 35, trend: "down", avatar: "K", level: "Intermediate" },
    { rank: 19, name: "Laura Martinez", xp: 770, points: 7700, team: "Support", gap: 35, trend: "up", avatar: "L", level: "Intermediate" },
    { rank: 20, name: "Michael Nguyen", xp: 735, points: 7350, team: "Operations", gap: 35, trend: "same", avatar: "M", level: "Intermediate" },
    { rank: 21, name: "Nancy O'Brien", xp: 700, points: 7000, team: "Corporate", gap: 35, trend: "down", avatar: "N", level: "Intermediate" },
    { rank: 22, name: "Oscar Perez", xp: 665, points: 6650, team: "Marketing", gap: 35, trend: "up", avatar: "O", level: "Intermediate" },
    { rank: 23, name: "Patricia Quinn", xp: 630, points: 6300, team: "Team Alpha", gap: 35, trend: "same", avatar: "P", level: "Intermediate" },
  ],
  currentUser: {
    rank: 12,
    name: "You",
    xp: 1020,
    points: 10200,
    team: "Innovators",
    gap: 20,
    avatar: "Y",
    level: "Expert",
  },
  lastUpdated: "5 mins ago",
  // New XP-based leaderboard data
  levelTiers: [
    { name: "Master", minXP: 1500, color: "from-amber-400 to-orange-500", icon: "👑" },
    { name: "Elite", minXP: 1200, color: "from-purple-500 to-pink-500", icon: "💎" },
    { name: "Expert", minXP: 900, color: "from-cyan-400 to-blue-500", icon: "⚡" },
    { name: "Diamond", minXP: 500, color: "from-emerald-400 to-green-500", icon: "🌟" },
    { name: "Elite Master", minXP: 0, color: "from-gray-400 to-slate-500", icon: "🔰" },
  ],
  weeklyRewards: {
    top3: { points: 500, scratchCards: 3 },
    top10: { points: 250, scratchCards: 2 },
    top25Percent: { points: 100, scratchCards: 1 },
  },
  promotionZones: {
    promoted: 20, // Top 20 get promoted
    safeZone: 25, // Next 25% are safe
    demotionZone: 55, // Rest face demotion
  },
  monthStartDate: "Jan 1, 2026",
  currentWeek: "Jan 19 - Jan 25",
};

export const agentPlayzoneMock = {
  streak: 7,
  totalPoints: 12450,
  tokenBalance: 65,
  tokensNeeded: 100,
  countdown: { hours: 4, minutes: 23, seconds: 15 },
  revenueProgress: 85,
  // For demo: set wheelUnlocked to true to show spin wheel
  wheelUnlocked: true,
  scratchCardAvailable: true,
  scratchReward: "+500 PTS",
  weekRange: "Sun Jan 19 - Sat Jan 25",
  
  // Daily missions for gamified progress
  dailyMissions: [
    { id: 1, title: "Complete 10 calls", progress: 100, completed: true, reward: "+50 PTS", icon: "📞" },
    { id: 2, title: "Revenue > $200", progress: 100, completed: true, reward: "+75 PTS", icon: "💰", current: "$250", target: "$200" },
    { id: 3, title: "QA Score > 90%", progress: 85, completed: false, reward: "+50 PTS", icon: "✅", current: "85%", target: "90%" },
    { id: 4, title: "First Call Resolution", progress: 60, completed: false, reward: "+100 PTS", icon: "🎯", current: "3", target: "5" },
    { id: 5, title: "Customer Compliment", progress: 0, completed: false, reward: "+150 PTS", icon: "⭐", current: "0", target: "1" },
  ],

  // Today's performance metrics for scratch card eligibility
  todaysPerformance: {
    meetsThreshold: true,
    metric: { name: "Revenue", value: "$520", target: "$500", remaining: "$0" },
  },

  // Weekly challenges for spin wheel unlock
  weeklyChallenges: [
    {
      id: "nrpc-streak",
      title: "NRPC Streak",
      description: "NRPC > $10 for 3 continuous days",
      tokens: 20,
      metric: "NRPC",
      target: "> $10",
      duration: "3 days streak",
      progress: 67,
      currentValue: "$12.50",
      daysCompleted: 2,
      daysRequired: 3,
      accepted: true,
      completed: false,
    },
    {
      id: "nconv-weekly",
      title: "Conversion Master",
      description: "NConv% > 15% for the week",
      tokens: 30,
      metric: "NConv%",
      target: "> 15%",
      duration: "Weekly",
      progress: 85,
      currentValue: "17.2%",
      accepted: true,
      completed: false,
    },
    {
      id: "nps-weekly",
      title: "Customer Champion",
      description: "NPS > 70 for the week",
      tokens: 20,
      metric: "NPS",
      target: "> 70",
      duration: "Weekly",
      progress: 100,
      currentValue: "78",
      accepted: true,
      completed: true,
    },
    {
      id: "naos-weekly",
      title: "Sales Excellence",
      description: "NAOS > $50 for at least 3 days",
      tokens: 20,
      metric: "NAOS",
      target: "> $50",
      duration: "3+ days",
      progress: 40,
      currentValue: "$45",
      daysCompleted: 1,
      daysRequired: 3,
      accepted: false,
      completed: false,
    },
    {
      id: "qa-weekly",
      title: "Quality Guardian",
      description: "QA Score > 80% for the week",
      tokens: 10,
      metric: "QA Score",
      target: "> 80%",
      duration: "Weekly",
      progress: 90,
      currentValue: "92%",
      accepted: true,
      completed: false,
    },
  ],

  // Scratch card showcase data (Google Pay style)
  scratchCards: [
    {
      id: 1,
      date: "Today",
      status: "pending",
      reward: "???",
      expiresIn: "23h 45m",
      source: "Daily Performance",
      metric: { name: "Revenue", value: "$520", target: "$500", met: true },
    },
    {
      id: 2,
      date: "Yesterday",
      status: "pending",
      reward: "???",
      expiresIn: "12h 30m",
      source: "QA Excellence",
      metric: { name: "QA Score", value: "95%", target: "90%", met: true },
    },
    {
      id: 3,
      date: "2 days ago",
      status: "scratched",
      reward: "+250 PTS",
      source: "NPS Achievement",
      claimedAt: "Jan 22, 2:30 PM",
    },
    {
      id: 4,
      date: "3 days ago",
      status: "expired",
      reward: "Expired",
      source: "Daily Streak",
      expiredAt: "Jan 21",
    },
    {
      id: 5,
      date: "4 days ago",
      status: "scratched",
      reward: "+500 PTS",
      source: "Weekly Bonus",
      claimedAt: "Jan 20, 11:15 AM",
    },
  ],

  // Earning history timeline
  earningHistory: [
    { id: 1, type: "spin-wheel", title: "Lucky Spin Win", reward: "+500 PTS", tokens: 10, timestamp: "Today, 2:30 PM" },
    { id: 2, type: "scratch-card", title: "Daily Scratch Card", reward: "+250 PTS", tokens: 5, timestamp: "Today, 10:15 AM" },
    { id: 3, type: "challenge", title: "Weekly Challenge: NPS", reward: "+20 TOKENS", tokens: 20, timestamp: "Yesterday, 5:00 PM" },
    { id: 4, type: "streak", title: "7-Day Streak Bonus", reward: "+100 PTS", tokens: 15, timestamp: "Yesterday, 9:00 AM" },
    { id: 5, type: "spin-wheel", title: "Spin Wheel - Mystery Box", reward: "🎁 Mystery Reward", tokens: 0, timestamp: "2 days ago" },
    { id: 6, type: "scratch-card", title: "Performance Scratch Card", reward: "+750 PTS", tokens: 8, timestamp: "2 days ago" },
  ],

  // Daily performance score (now at bottom)
  dailyPerformanceScore: {
    score: 88,
    grade: "A",
    metrics: [
      { name: "Revenue", value: "$520", target: "$500", progress: 104, status: "excellent" },
      { name: "QA Score", value: "92%", target: "90%", progress: 102, status: "excellent" },
      { name: "NPS", value: "78", target: "70", progress: 111, status: "excellent" },
      { name: "AHT", value: "4:30", target: "5:00", progress: 90, status: "on-track" },
    ],
  },

  achievements: [
    { name: "First Win", icon: "trophy", rarity: "common", unlocked: true, progress: 100 },
    { name: "Speed Demon", icon: "zap", rarity: "rare", unlocked: true, progress: 100 },
    { name: "Team Leader", icon: "crown", rarity: "epic", unlocked: false, progress: 75 },
    { name: "Legend", icon: "diamond", rarity: "legendary", unlocked: false, progress: 45 },
  ],
  recentActivity: [
    { game: "Daily Scratch", loot: "gold-ticket", status: "active", statusLabel: "ACTIVE" },
    { game: "Mystery Box", loot: "mystery", status: "claimed", statusLabel: "CLAIMED" },
    { game: "Mystery Loot", loot: "chest", status: "processing", statusLabel: "PROCESSING" },
  ],
};

export const agentRewardsMock = {
  balance: 12500,
  rank: "Gold",
  nextRankPoints: 15000,
  categories: [
    { id: "all", label: "All Items" },
    { id: "gift-cards", label: "Gift Cards" },
    { id: "time-off", label: "Time Off" },
    { id: "tech", label: "Tech Gear" },
    { id: "experiences", label: "Experiences" },
  ],
  rewards: [
    { id: 1, title: "Amazon Gift Card", description: "$50 Digital Gift Card delivered instantly", points: 5000, status: "in-stock", image: "🎁", category: "gift-cards", rarity: "common" },
    { id: 2, title: "Extra 1-Hour Break", description: "Redeem for an extended lunch break", points: 1000, status: "limited", stock: 2, image: "☕", category: "time-off", rarity: "rare" },
    { id: 3, title: "Platinum VIP Lounge", description: "Exclusive access to premium tier", points: 25000, status: "locked", requiredRank: "Platinum", image: "👑", category: "experiences", rarity: "legendary" },
    { id: 4, title: "Noise-Cancelling Headphones", description: "Premium Sony WH-1000XM5", points: 15000, status: "in-stock", image: "🎧", category: "tech", rarity: "epic" },
    { id: 5, title: "Concert Tickets", description: "Two VIP tickets to a live concert", points: 12000, status: "in-stock", image: "🎫", category: "experiences", rarity: "epic" },
    { id: 6, title: "Spa Day Package", description: "Full day spa treatment", points: 8000, status: "in-stock", image: "💆", category: "experiences", rarity: "rare" },
  ],
  redemptionHistory: [
    { item: "Spotify Premium (1 Mo)", status: "delivered", date: "2 days ago", points: 800 },
    { item: "Starbucks Gift Card ($10)", status: "delivered", date: "1 week ago", points: 1200 },
    { item: "Company Swag Hoodie", status: "processing", date: "2 weeks ago", points: 3500 },
    { item: "Extra Break (30min)", status: "used", date: "1 month ago", points: 500 },
  ],
};

export const agentAchievementsMock = {
  level: {
    level: 42,
    title: "Elite Agent",
    currentXP: 2450,
    nextLevelXP: 3000,
    totalXP: 84750,
    progress: 82,
  },
  badges: [
    { icon: Flame, title: "Elite Streak", description: "7-day performance streak", earned: true, date: "Jan 15", color: "from-orange-500 to-red-500", glow: "shadow-orange-500/30" },
    { icon: Target, title: "Bullseye", description: "Hit 100% of daily targets", earned: true, date: "Jan 12", color: "from-emerald-400 to-green-600", glow: "shadow-emerald-500/30" },
    { icon: Trophy, title: "Champion", description: "Reach #1 on leaderboard", earned: true, date: "Jan 10", color: "from-amber-400 to-yellow-500", glow: "shadow-amber-500/30" },
    { icon: Star, title: "Rising Star", description: "First week performance bonus", earned: true, date: "Jan 5", color: "from-purple-400 to-pink-500", glow: "shadow-purple-500/30" },
    { icon: Zap, title: "Speed Demon", description: "Best AHT in your team", earned: true, date: "Dec 28", color: "from-cyan-400 to-blue-500", glow: "shadow-cyan-500/30" },
    { icon: Crown, title: "Royalty", description: "Maintain Elite status for 30 days", earned: false, progress: 65, color: "from-amber-500 to-orange-500" },
    { icon: Shield, title: "Defender", description: "100% QA score for a month", earned: false, progress: 80, color: "from-blue-400 to-indigo-600" },
    { icon: Award, title: "Legend", description: "Earn 100,000 lifetime points", earned: false, progress: 45, color: "from-pink-500 to-rose-600" },
  ],
  milestones: [
    { title: "First Login", completed: true, xp: 100, icon: "🚀" },
    { title: "Complete Training", completed: true, xp: 500, icon: "📚" },
    { title: "First Sale", completed: true, xp: 250, icon: "💰" },
    { title: "7-Day Streak", completed: true, xp: 1000, icon: "🔥" },
    { title: "30-Day Streak", completed: false, xp: 5000, progress: 17, icon: "⚡" },
    { title: "Top 10 Finish", completed: true, xp: 2000, icon: "🏆" },
    { title: "First Spin Win", completed: true, xp: 500, icon: "🎰" },
    { title: "Redeem First Reward", completed: false, xp: 300, progress: 0, icon: "🎁" },
  ],
  stats: {
    earnedBadges: 5,
    streak: 12,
    completionRate: 98,
  },
};
