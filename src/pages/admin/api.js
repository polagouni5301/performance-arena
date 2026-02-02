/**
 * Admin API Layer
 * Functions representing backend endpoints for Admin role.
 */

import { adminApi } from '@/api';

/**
 * Mock data for Audit Logs and Alerts
 * This data is static and doesn't change, so we use hardcoded mock data instead of API calls
 */
const AUDIT_LOGS_MOCK_DATA = {
  claimLogs: [
    {
      date: "2024-01-15 14:32",
      agent: "Sarah Johnson",
      initials: "SJ",
      color: "bg-purple-500",
      reward: "Amazon Gift Card",
      points: 2500,
      status: "Fulfilled"
    },
    {
      date: "2024-01-15 13:45",
      agent: "Mike Chen",
      initials: "MC",
      color: "bg-blue-500",
      reward: "Starbucks Voucher",
      points: 1200,
      status: "Fulfilled"
    },
    {
      date: "2024-01-15 12:20",
      agent: "Emily Rodriguez",
      initials: "ER",
      color: "bg-pink-500",
      reward: "Sony Headphones",
      points: 5000,
      status: "Pending Approval"
    },
    {
      date: "2024-01-14 16:55",
      agent: "David Kumar",
      initials: "DK",
      color: "bg-green-500",
      reward: "iPad Pro 256GB",
      points: 8500,
      status: "Shipped"
    },
    {
      date: "2024-01-14 11:30",
      agent: "Jessica Liu",
      initials: "JL",
      color: "bg-orange-500",
      reward: "Gaming Mouse",
      points: 1500,
      status: "Fulfilled"
    },
    {
      date: "2024-01-13 09:15",
      agent: "Robert Martinez",
      initials: "RM",
      color: "bg-red-500",
      reward: "Mechanical Keyboard",
      points: 2200,
      status: "Fulfilled"
    },
    {
      date: "2024-01-12 15:42",
      agent: "Lisa Wong",
      initials: "LW",
      color: "bg-indigo-500",
      reward: "Google Nest Hub",
      points: 3500,
      status: "Rejected"
    },
    {
      date: "2024-01-12 10:20",
      agent: "James Brown",
      initials: "JB",
      color: "bg-cyan-500",
      reward: "Airpods Pro",
      points: 2800,
      status: "Fulfilled"
    },
  ],
  emailTriggers: [
    {
      name: "High Value Redemption",
      enabled: true,
      desc: "Alert when reward > 5000 points claimed"
    },
    {
      name: "Weekly Summary Report",
      enabled: true,
      desc: "Send aggregated activity report every Monday 9 AM"
    },
    {
      name: "Claim Approval Needed",
      enabled: true,
      desc: "Notify admins when claim requires manual approval"
    },
    {
      name: "Stock Alert",
      enabled: false,
      desc: "Notify when reward stock falls below 10 items"
    },
    {
      name: "System Error Log",
      enabled: true,
      desc: "Critical system errors and failures detected"
    },
  ],
  downloadReports: [
    {
      name: "Monthly Audit Report",
      desc: "Comprehensive reward and points audit for the month",
      icon: "FileText"
    },
    {
      name: "User Activity Log",
      desc: "Detailed user interactions and transactions",
      icon: "Database"
    },
    {
      name: "Revenue Analytics",
      desc: "Points distribution and redemption trends",
      icon: "Calendar"
    },
  ],
  pagination: {
    showing: 8,
    total: 247,
  }
};

export const fetchAdminOverview = async () => {
  return adminApi.getOverview();
};

export const fetchMetrics = async () => {
  return adminApi.getMetrics();
};

export const updateMetric = async (metricId, metricData) => {
  return adminApi.updateMetric(metricId, metricData);
};

export const createMetric = async (metricData) => {
  return adminApi.createMetric(metricData);
};

export const fetchPointsRules = async () => {
  return adminApi.getPointsRules();
};

export const updatePointsRules = async (rulesData) => {
  return adminApi.updatePointsRules(rulesData);
};

export const simulatePointsRules = async (simulationData) => {
  return adminApi.simulatePointsRules(simulationData);
};

export const fetchRewardsCatalog = async (filters = {}) => {
  return adminApi.getRewardsCatalog(filters);
};

export const createReward = async (rewardData) => {
  return adminApi.createReward(rewardData);
};

export const updateReward = async (rewardId, rewardData) => {
  return adminApi.updateReward(rewardId, rewardData);
};

export const deleteReward = async (rewardId) => {
  return adminApi.deleteReward(rewardId);
};

export const updateStock = async (rewardId, stockData) => {
  return adminApi.updateStock(rewardId, stockData);
};

export const fetchAuditLogs = async (filters = {}) => {
  try {
    // Try to fetch from backend API first for real guide data
    const result = await adminApi.getAuditLogs(filters);
    return result;
  } catch (error) {
    // Fallback to mock data if API fails
    console.warn('Failed to fetch audit logs from API, using mock data:', error);
    return AUDIT_LOGS_MOCK_DATA;
  }
};

export const updateEmailTrigger = async (triggerName, triggerData) => {
  return adminApi.toggleEmailTrigger(triggerName, triggerData);
};

export const exportAuditReport = async (reportType) => {
  return adminApi.exportAuditReport(reportType);
};
