
const ROLES = {
  AGENT: 'agent',
  MANAGER: 'manager',
  LEADERSHIP: 'leadership',
  ADMIN: 'admin'
};

const METRIC_KEYS = {
  AHT: 'aht',
  QA: 'qa',
  REVENUE: 'revenue',
  NPS: 'nps',
  CSAT: 'csat',
  FCR: 'fcr',
  CALLS_HANDLED: 'calls_handled',
  TICKETS_CLOSED: 'tickets_closed'
};

const STATUSES = {
  EXCELLENT: 'excellent',
  ON_TRACK: 'on-track',
  AT_RISK: 'at-risk',
  CRITICAL: 'critical',
  NO_DATA: 'no-data'
};

const TIME_RANGES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

const VIEW_TYPES = {
  INDIVIDUAL: 'individual',
  TEAM: 'team'
};

module.exports = {
  ROLES,
  METRIC_KEYS,
  STATUSES,
  TIME_RANGES,
  VIEW_TYPES
};