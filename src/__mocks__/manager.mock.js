
export const managerOverviewMock = {
  teamHealthScore: 84,
  teamHealthChange: 5.2,
  participationRate: 92,
  participationChange: -1.8,
  pointsBudget: 4500,
  pointsRemaining: 150,
  team: "Sales Team Alpha",
  lastUpdated: "Just now",
  weeklyData: [
    { day: "MON", current: 45, previous: 40, target: 80 },
    { day: "TUE", current: 52, previous: 48, target: 80 },
    { day: "WED", current: 61, previous: 55, target: 80 },
    { day: "THU", current: 58, previous: 52, target: 80 },
    { day: "FRI", current: 72, previous: 68, target: 80 },
    { day: "SAT", current: 78, previous: 72, target: 80 },
    { day: "SUN", current: 68, previous: 65, target: 80 },
  ],
  topPerformers: [
    { name: "Sarah Jenkins", dept: "Sales", xp: 9800, rank: 1, avatar: "S" },
    { name: "David Chen", dept: "Support", xp: 9500, rank: 2, avatar: "D" },
    { name: "Maria Rodriguez", dept: "Sales", xp: 9200, rank: 3, avatar: "M" },
  ],
  attentionNeeded: [
    { name: "James Wilson", issue: "Qual Score (-12%)", type: "coach" },
    { name: "Robert Fox", issue: "Attendance Alert", type: "nudge" },
    { name: "Emily Davis", issue: "AHT Critical", type: "review" },
  ],
  liveFeed: [
    { name: "Lisa M.", action: "closed a deal worth", value: "500pts", time: "2 mins ago", dept: "Sales" },
    { name: "Tom H.", action: "achieved daily target.", value: "", time: "15 mins ago", dept: "Support" },
    { name: "Team Contest", action: '"Sprint" has ended.', value: "", time: "1 hour ago", dept: "System" },
  ],
  insight: "Agents who receive coaching within 24h of a performance dip recover 2x faster.",
};

export const managerTeamPerformanceMock = {
  filters: {
    dateRange: "7d",
    metricFilter: "all",
    teamFilter: "alpha",
  },
  agents: [
    {
      name: "Sarah Jenkins", role: "Senior Agent", avatar: "S",
      aht: { value: 245, status: "exceeding", label: "Target: 300s" },
      qa: { value: 98.5, status: "exceeding", label: "Target: 90%" },
      revenue: { value: 4200, status: "exceeding", label: "Top 5%" },
    },
    {
      name: "David Chen", role: "Agent", avatar: "D",
      aht: { value: 290, status: "on-target", label: "On Target" },
      qa: { value: 72.0, status: "at-risk", label: "Target: 90%" },
      revenue: { value: 1800, status: "below", label: "Target: $2k" },
    },
    {
      name: "Maria Rodriguez", role: "Agent", avatar: "M",
      aht: { value: 380, status: "below", label: "Target: 300s" },
      qa: { value: 92.0, status: "exceeding", label: "Target: 90%" },
      revenue: { value: 2900, status: "on-target", label: "Stable" },
    },
    {
      name: "James Wilson", role: "Junior Agent", avatar: "J",
      aht: { value: 420, status: "critical", label: "Critical" },
      qa: { value: 82.0, status: "below", label: "Below Avg" },
      revenue: { value: 1200, status: "on-target", label: "Ramping" },
    },
    {
      name: "Robert Fox", role: "Agent", avatar: "R",
      aht: { value: 295, status: "exceeding", label: "On Target" },
      qa: { value: 91.5, status: "on-target", label: "Consistent" },
      revenue: { value: 2300, status: "exceeding", label: "Growth" },
    },
  ],
  selectedAgentInsight: {
    agentName: "David Chen",
    analysis: "QA Score: 72%",
    trend: "down",
    gap: "18% below team target",
    details: 'Major gaps identified in "empathy" and "solution accuracy" criteria.',
    pattern: "David's QA scores drop significantly on calls longer than 8 minutes. Focus coaching on call control techniques.",
    history: [
      { action: 'Sent "Kudos" for NPS', time: "2 days ago", by: "AM" },
    ],
    recommendedActions: [
      { type: "coaching", title: "Schedule 1:1 Coaching", desc: "Review last 3 failed calls together." },
      { type: "training", title: "Assign Training Module", desc: '"Advanced Empathy & Tone" (15m)' },
    ],
  },
};

export const managerContestsMock = {
  activeContests: [
    {
      id: 1, name: "Q4 Revenue Sprint", status: "live",
      objective: "Close $50k in new deals",
      progress: 78, target: 50000, current: 39000,
      timeRemaining: "02d 14h 30m", participants: 12,
    },
    {
      id: 2, name: "Customer Delight Week", status: "upcoming",
      objective: "100+ positive reviews",
      scheduledStart: "Tomorrow, 9:00 AM", participants: 15,
    },
  ],
  pastContests: [
    { name: "Weekend Warrior", dates: "Oct 12 - Oct 14", winner: "Sarah J.", winnerAvatar: "S", reward: 500, impact: "+15% Sales", status: "completed" },
    { name: "CSAT Booster", dates: "Sep 28 - Oct 05", winner: "David C.", winnerAvatar: "D", reward: 250, impact: "+0.8 Stars", status: "completed" },
    { name: "Q3 Finals", dates: "Aug 01 - Aug 31", winner: "Maria R.", winnerAvatar: "M", reward: 1200, impact: "+22% Revenue", status: "completed" },
  ],
  liveFeed: [
    { name: "Lisa M.", action: 'just took the lead in "Revenue Sprint"!', time: "2 mins ago", avatar: "L" },
    { name: "Tom H.", action: 'unlocked the "Early Bird" Bonus.', time: "15 mins ago", avatar: "T" },
    { name: "Contest", action: '"Power Hour" ended.', time: "1 hour ago", avatar: "⚡" },
  ],
  tip: "Shorter sprints (3-5 days) often yield 2x engagement vs monthly ones.",
};

export const managerRewardsAuditMock = {
  totalDistributed: 142500,
  remainingBudget: 3250,
  totalBudget: 12000,
  budgetChange: 12,
  pointsByMetric: [
    { name: "REVENUE", value: 42000, color: "hsl(var(--primary))" },
    { name: "QA SCORE", value: 28000, color: "hsl(var(--secondary))" },
    { name: "CSAT", value: 35000, color: "hsl(var(--success))" },
    { name: "ADHERENCE", value: 22000, color: "hsl(var(--warning))" },
    { name: "OTHER", value: 15500, color: "hsl(var(--muted-foreground))" },
  ],
  rewardHistory: [
    { agent: "Sarah Jenkins", avatar: "S", reward: "$50 Gift Card", points: 2500, date: "Oct 15, 2023", status: "claimed" },
    { agent: "David Chen", avatar: "D", reward: "Lunch w/ CEO", points: 5000, date: "Oct 14, 2023", status: "pending" },
    { agent: "Maria Rodriguez", avatar: "M", reward: "Extra PTO Day", points: 4000, date: "Oct 12, 2023", status: "claimed" },
    { agent: "James Wilson", avatar: "J", reward: "$25 Amazon", points: 1500, date: "Oct 10, 2023", status: "claimed" },
  ],
  liveRedemptions: [
    { name: "Lisa M.", action: "redeemed", value: "$50 Card.", time: "2 mins ago", avatar: "L" },
    { name: "Tom H.", action: "redeemed", value: "Lunch w/ CEO.", time: "15 mins ago", avatar: "T" },
    { name: "Inventory", action: "Updated.", value: "", time: "1 hour ago", avatar: "📦" },
  ],
  fairnessAlert: "Top 10% of performers are claiming 60% of rewards. Consider adjusting tiers.",
};
