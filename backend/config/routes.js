
const ROUTES = {
  
  AGENT_DASHBOARD: '/api/agent/:agentId/dashboard',
  AGENT_PERFORMANCE: '/api/agent/:agentId/performance',
  AGENT_LEADERBOARD: '/api/agent/leaderboard',
  AGENT_PLAYZONE: '/api/agent/:agentId/playzone',
  AGENT_ACHIEVEMENTS: '/api/agent/:agentId/achievements',
  AGENT_REWARDS_VAULT: '/api/agent/:agentId/rewards-vault',

  
  MANAGER_OVERVIEW: '/api/manager/:managerId/overview',
  MANAGER_TEAM_PERFORMANCE: '/api/manager/:managerId/team-performance',
  MANAGER_CONTESTS: '/api/manager/:managerId/contests',
  MANAGER_REWARDS_AUDIT: '/api/manager/:managerId/rewards-audit',

  
  LEADERSHIP_OVERVIEW: '/api/leadership/overview',
  LEADERSHIP_LEADERBOARDS: '/api/leadership/leaderboards',
  LEADERSHIP_REPORTS: '/api/leadership/reports',
  LEADERSHIP_ROI: '/api/leadership/roi',

  
  ADMIN_OVERVIEW: '/api/admin/overview',
  ADMIN_METRICS: '/api/admin/metrics',
  ADMIN_POINTS_RULES: '/api/admin/points-rules',
  ADMIN_REWARDS_CATALOG: '/api/admin/rewards-catalog',
  ADMIN_AUDIT_LOGS: '/api/admin/audit-logs',

  
  AUTH_LOGIN: '/api/auth/login'
};

module.exports = ROUTES;