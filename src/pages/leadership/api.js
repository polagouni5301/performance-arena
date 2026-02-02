
import { leadershipApi } from '@/api';

export const fetchLeadershipOverview = async () => {
  return leadershipApi.getOverview();
};

export const fetchLeadershipLeaderboards = async (filters = {}) => {
  return leadershipApi.getLeaderboards(filters);
};

export const fetchLeadershipReports = async (activeTab = 'Revenue') => {
  return leadershipApi.getReports({ activeTab });
};

export const fetchLeadershipROI = async (fiscalYear = 'FY2024') => {
  return leadershipApi.getROI({ fiscalYear });
};

export const exportReport = async (reportType, format) => {
  return leadershipApi.exportReport({ reportType, format });
};
