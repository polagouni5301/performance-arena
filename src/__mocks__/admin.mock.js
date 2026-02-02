
export const adminOverviewMock = {
  kpis: {
    activeUsers: { value: "1,248", change: "+4.5% vs last week", changeType: "positive" },
    activeContests: { value: "12", subtitle: "2 ending soon" },
    rewardsInStock: { value: "850", alert: "Low stock on 3 items" },
    criticalWarnings: { value: "2", subtitle: "Requires immediate attention", highlight: true },
  },
  systemHealth: {
    status: "Operational",
    apiLatency: { value: "42ms", status: "Good" },
    lastSync: { value: "2m ago", status: "Auto", subtitle: "Synced 15k records" },
    errorRate: { value: "Low", status: "0.01%", progress: 1 },
  },
  lowStockAlerts: [
    { name: "Wireless Headset Pro", category: "Electronics", stock: 4, status: "Critical", icon: "Headphones" },
    { name: "₹4,000 Amazon Gift Card", category: "Vouchers", stock: 12, status: "Low", icon: "CreditCard" },
    { name: "Branded Hoodie (L)", category: "Merch", stock: 8, status: "Low", icon: "Shirt" },
  ],
  recentActivity: [
    { icon: "SlidersHorizontal", title: "Rule Updated: AHT Weightage", desc: "Changed from 25% to 30% by Sarah Jenkins.", time: "10 mins ago", color: "text-primary" },
    { icon: "AlertTriangle", title: "Fraud Alert Triggered", desc: "User ID #8821 exceeded daily point cap (5000pts).", time: "45 mins ago", color: "text-warning" },
    { icon: "Package", title: "Bulk Inventory Added", desc: "Restocked 200 'Movie Tickets' to catalog.", time: "2 hours ago", color: "text-secondary" },
    { icon: "Zap", title: "New Contest Launched", desc: "'Q4 Sprint' is now active for Sales Dept.", time: "5 hours ago", color: "text-primary" },
  ],
};

export const adminMetricsMock = {
  metrics: [
    { id: 1, name: "AHT (Handle Time)", category: "Efficiency", target: "< 400 sec", weightage: 30, cap: "Max 5,000 pts", type: "Operational", status: "Enabled", icon: "Clock", color: "text-secondary" },
    { id: 2, name: "QA Score", category: "Quality Control", target: "> 95%", weightage: 50, cap: "Max 3,000 pts", type: "Operational", status: "Enabled", icon: "CheckCircle", color: "text-success" },
    { id: 3, name: "Revenue Generated", category: "Sales", target: "> $5,000", weightage: 20, cap: "Unlimited", type: "Business", status: "Enabled", icon: "DollarSign", color: "text-primary" },
    { id: 4, name: "CSAT Score", category: "Customer Satisfaction", target: "> 4.5 Stars", weightage: 0, cap: "-", type: "Business", status: "Disabled", icon: "Star", color: "text-warning" },
    { id: 5, name: "Adherence", category: "Attendance", target: "98%", weightage: 0, cap: "Max 1,000 pts", type: "Operational", status: "Disabled", icon: "Calendar", color: "text-muted-foreground" },
  ],
  summary: {
    totalWeightage: 100,
    activeKPIs: 3,
    operationalCount: 2,
    businessCount: 1,
  },
};

export const adminPointsRulesMock = {
  kpiWeightage: [
    { id: "aht", name: "AHT", value: 25 },
    { id: "qa", name: "QA Score", value: 45 },
    { id: "revenue", name: "Revenue", value: 30 },
  ],
  tierMultipliers: {
    topTier: { label: "Top 10%", multiplier: 1.5 },
    midTier: { label: "11-50%", multiplier: 1.0 },
    standard: { label: "51-100%", multiplier: 0.8 },
  },
  rewardProbability: [
    { id: "mega", name: "Mega Jackpot", probability: 5, color: "primary" },
    { id: "rare", name: "Rare Bonus", probability: 25, color: "secondary" },
    { id: "common", name: "Common Reward", probability: 70, color: "muted" },
  ],
  globalCaps: {
    daily: { enabled: true, value: 500 },
    weekly: { enabled: true, value: 2000 },
    monthly: { enabled: false, value: 5000 },
  },
  lastUpdated: "2 hours ago",
  lastUpdatedBy: "Admin User",
};

export const adminRewardsCatalogMock = {
  rewards: [
    { id: "RWD-1024", name: "Premium Coffee Kit", category: "Physical Gift", pointCost: 2500, stock: 3, status: "Low Stock", icon: "Coffee" },
    { id: "RWD-2055", name: "₹4,000 Amazon Voucher", category: "Voucher", pointCost: 5000, stock: 142, status: "Active", icon: "CreditCard" },
    { id: "RWD-3301", name: "Extra WFH Day", category: "Perk", pointCost: 10000, stock: "Unlimited", status: "Active", icon: "Star" },
    { id: "RWD-1050", name: "Noise Cancelling Headphones", category: "Physical Gift", pointCost: 15000, stock: 0, status: "Out of Stock", icon: "Headphones" },
    { id: "RWD-4002", name: "Gaming Pass (1 Month)", category: "Voucher", pointCost: 1200, stock: 2, status: "Low Stock", icon: "Gamepad2" },
  ],
  categories: ["All Categories", "Physical Gift", "Voucher", "Perk", "Experience"],
  statuses: ["All Statuses", "Active", "Low Stock", "Out of Stock"],
  pagination: {
    total: 48,
    perPage: 5,
    currentPage: 1,
  },
};

export const adminAuditLogsMock = {
  claimLogs: [
    { date: "Oct 24, 10:42 AM", agent: "Michael Chen", initials: "M", color: "bg-secondary", reward: "Amazon Gift Card (₹4,000)", points: -5000, status: "Fulfilled" },
    { date: "Oct 24, 09:15 AM", agent: "Sarah Miller", initials: "S", color: "bg-success", reward: "Extra PTO Day", points: -12500, status: "Pending Approval" },
    { date: "Oct 23, 04:55 PM", agent: "James Wilson", initials: "J", color: "bg-warning", reward: "Company Hoodie", points: -2500, status: "Shipped" },
    { date: "Oct 23, 02:30 PM", agent: "Emily Davis", initials: "E", color: "bg-primary", reward: "Lunch with CEO", points: -25000, status: "Scheduled" },
    { date: "Oct 23, 11:15 AM", agent: "Robert Lang", initials: "R", color: "bg-destructive", reward: "Tech Store Voucher", points: -8000, status: "Rejected" },
  ],
  emailTriggers: [
    { name: "Reward Claimed", desc: "Notify admin on redemption", enabled: true },
    { name: "Low Stock Alert", desc: "Inventory falls below 10%", enabled: true },
    { name: "Monthly Summary", desc: "Auto-email monthly stats", enabled: false },
  ],
  downloadReports: [
    { name: "Reward Summary", desc: "Last 30 Days • PDF", icon: "Calendar" },
    { name: "Stock Report", desc: "Weekly Log • CSV", icon: "FileText" },
    { name: "Audit Trail", desc: "Full System Dump • CSV", icon: "Database" },
  ],
  pagination: {
    total: 1284,
    showing: 5,
  },
};

export const contestBuilderMock = {
  contests: [
    {
      id: 1,
      name: "Q4 Revenue Sprint",
      status: "published",
      startDate: "2026-02-01",
      endDate: "2026-02-15",
      metrics: [
        { id: 1, name: "Revenue Generated", target: "> $10K", weightage: 50 },
        { id: 2, name: "Customer Count", target: "> 50", weightage: 30 },
        { id: 3, name: "Customer Satisfaction", target: "> 95%", weightage: 20 },
      ],
      rewards: [
        { id: 1, position: "1st", title: "Premium Gift Card", description: "₹10,000 Shopping Voucher", points: 5000 },
        { id: 2, position: "2nd", title: "Exclusive Headphones", description: "Noise Cancelling Tech", points: 3000 },
        { id: 3, position: "3rd", title: "Gift Hamper", description: "Gourmet Treats Pack", points: 1000 },
      ],
      theme: {
        primary: "#8B5CF6",
        secondary: "#A855F7",
        accent: "#EC4899",
        backgroundColor: "#1a1a2e",
      },
      bannerText: "Drive maximum revenue in Q4. Compete with your team and win exclusive rewards!",
      description: "Drive maximum revenue growth in Q4",
      targetAudience: "all",
      createdAt: "Jan 20, 2026",
      participants: 145,
      bannerPublished: true,
      bannerImpressions: 2847,
      registrations: 145,
    },
    {
      id: 2,
      name: "Customer Satisfaction Blitz",
      status: "draft",
      startDate: "2026-02-15",
      endDate: "2026-03-01",
      metrics: [
        { id: 1, name: "CSAT Score", target: "> 4.8/5.0", weightage: 40 },
        { id: 2, name: "Resolution Time", target: "< 30 min", weightage: 35 },
        { id: 3, name: "First Contact Fix", target: "> 90%", weightage: 25 },
      ],
      rewards: [
        { id: 1, position: "1st", title: "Apple AirPods Pro", description: "Wireless Audio Experience", points: 6000 },
        { id: 2, position: "2nd", title: "Premium Watch", description: "Smart Watch Tech", points: 4000 },
        { id: 3, position: "Top 10", title: "Recognition Badge", description: "Exclusive Digital Badge", points: 500 },
      ],
      theme: {
        primary: "#3B82F6",
        secondary: "#0EA5E9",
        accent: "#06B6D4",
        backgroundColor: "#0f172a",
      },
      bannerText: "Achieve excellence in customer service. Show your satisfaction score!",
      description: "Achieve excellence in customer service",
      targetAudience: "all",
      createdAt: "Jan 15, 2026",
      participants: 0,
      bannerPublished: false,
    },
    {
      id: 3,
      name: "Sales Excellence Challenge",
      status: "published",
      startDate: "2026-01-15",
      endDate: "2026-01-31",
      metrics: [
        { id: 1, name: "Deal Closure Rate", target: "> 80%", weightage: 45 },
        { id: 2, name: "Deal Size", target: "> $50K avg", weightage: 35 },
        { id: 3, name: "Client Retention", target: "> 98%", weightage: 20 },
      ],
      rewards: [
        { id: 1, position: "1st", title: "International Trip Voucher", description: "5-Day Business Travel", points: 10000 },
        { id: 2, position: "2nd", title: "MacBook Air", description: "Latest Model", points: 8000 },
        { id: 3, position: "Top 5", title: "Premium Cash Bonus", description: "₹50K Bonus", points: 3000 },
      ],
      theme: {
        primary: "#EF4444",
        secondary: "#F97316",
        accent: "#FBBF24",
        backgroundColor: "#1a1a1a",
      },
      bannerText: "Close more deals, win bigger prizes. Sales team challenge!",
      description: "Challenge for the sales excellence",
      targetAudience: "all",
      createdAt: "Jan 10, 2026",
      participants: 98,
      bannerPublished: true,
      bannerImpressions: 1923,
      registrations: 98,
    },
  ],
  templates: [
    {
      id: "default",
      name: "Default Template",
      category: "Standard",
      description: "Standard contest template with metrics and rewards",
      thumbnail: "default.png",
    },
    {
      id: "sales",
      name: "Sales Competition",
      category: "Sales",
      description: "Optimized for sales team challenges",
      thumbnail: "sales.png",
    },
    {
      id: "customer",
      name: "Customer Focus",
      category: "Service",
      description: "Customer satisfaction and quality focused",
      thumbnail: "customer.png",
    },
    {
      id: "innovation",
      name: "Innovation Sprint",
      category: "Innovation",
      description: "For hackathons and innovation challenges",
      thumbnail: "innovation.png",
    },
  ],
  themePresets: [
    { name: "Purple Blitz", primary: "#8B5CF6", secondary: "#A855F7", accent: "#EC4899" },
    { name: "Ocean Wave", primary: "#3B82F6", secondary: "#0EA5E9", accent: "#06B6D4" },
    { name: "Fire Storm", primary: "#EF4444", secondary: "#F97316", accent: "#FBBF24" },
    { name: "Neon Nights", primary: "#EC4899", secondary: "#8B5CF6", accent: "#00D9FF" },
  ],
};
