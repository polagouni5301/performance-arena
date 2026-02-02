
import { managerApi } from '@/api';

/**
 * Transform team performance data from backend to frontend format
 * Backend now sends agents with proper metrics including actual AHT values
 */
const transformTeamPerformanceData = (backendData) => {
  if (!backendData || !backendData.topPerformers) {
    return { agents: [], selectedAgentInsight: null };
  }

  const { topPerformers, insightsCoaching } = backendData;

  // Collect all unique agents from the three metric arrays (aht, qa, revenue)
  const agentsMap = new Map();

  // Process AHT performers - value is already in seconds/minutes from backend
  (topPerformers.aht || []).forEach((performer) => {
    if (!agentsMap.has(performer.name)) {
      agentsMap.set(performer.name, {
        name: performer.name,
        avatar: performer.avatar,
        department: performer.department,
        aht: { value: performer.value, label: 'AHT', status: performer.value <= 20 ? 'exceeding' : performer.value <= 25 ? 'on-target' : 'at-risk' },
        qa: null,
        revenue: null,
        role: 'Agent',
      });
    } else {
      const agent = agentsMap.get(performer.name);
      agent.aht = { value: performer.value, label: 'AHT', status: performer.value <= 20 ? 'exceeding' : performer.value <= 25 ? 'on-target' : 'at-risk' };
    }
  });

  // Process QA performers
  (topPerformers.qa || []).forEach((performer) => {
    const qaValue = parseFloat(performer.value) || 0;
    if (!agentsMap.has(performer.name)) {
      agentsMap.set(performer.name, {
        name: performer.name,
        avatar: performer.avatar,
        department: performer.department,
        aht: null,
        qa: { value: qaValue, label: 'QA', status: qaValue >= 4 ? 'exceeding' : qaValue >= 3 ? 'on-target' : 'at-risk' },
        revenue: null,
        role: 'Agent',
      });
    } else {
      const agent = agentsMap.get(performer.name);
      agent.qa = { value: qaValue, label: 'QA', status: qaValue >= 4 ? 'exceeding' : qaValue >= 3 ? 'on-target' : 'at-risk' };
    }
  });

  // Process Revenue performers
  (topPerformers.revenue || []).forEach((performer) => {
    const revenueValue = typeof performer.value === 'string' 
      ? parseFloat(performer.value.replace('$', '')) 
      : performer.value;
    if (!agentsMap.has(performer.name)) {
      agentsMap.set(performer.name, {
        name: performer.name,
        avatar: performer.avatar,
        department: performer.department,
        aht: null,
        qa: null,
        revenue: { value: revenueValue, label: 'Revenue', status: revenueValue >= 500 ? 'exceeding' : revenueValue >= 300 ? 'on-target' : 'at-risk' },
        role: 'Agent',
      });
    } else {
      const agent = agentsMap.get(performer.name);
      agent.revenue = { value: revenueValue, label: 'Revenue', status: revenueValue >= 500 ? 'exceeding' : revenueValue >= 300 ? 'on-target' : 'at-risk' };
    }
  });

  // Fill in missing metric values with defaults
  const agents = Array.from(agentsMap.values()).map((agent) => {
    if (!agent.aht) agent.aht = { value: 0, label: 'AHT', status: 'on-target' };
    if (!agent.qa) agent.qa = { value: 0, label: 'QA', status: 'on-target' };
    if (!agent.revenue) agent.revenue = { value: 0, label: 'Revenue', status: 'on-target' };
    return agent;
  });

  // Build selected agent insight from bottom performers (coaching recommendations)
  const selectedAgentInsight = {
    analysis: 'Performance Review',
    details: insightsCoaching?.recommendations?.[0] || 'Continue monitoring performance metrics',
    recommendedActions: [
      { type: 'coaching', title: 'Schedule 1:1 Coaching', desc: 'Review performance metrics and discuss improvement areas.' },
      { type: 'training', title: 'Assign Training Module', desc: 'Focus on identified performance gaps.' },
    ],
    pattern: insightsCoaching?.recommendations?.[1] || 'Monitor team performance trends',
    history: [],
  };

  return {
    agents,
    selectedAgentInsight,
  };
};

export const fetchManagerOverview = async (managerId) => {
  return managerApi.getOverview(managerId);
};

export const fetchTeamPerformance = async (managerId, filters = {}) => {
  const backendData = await managerApi.getTeamPerformance(managerId);
  return transformTeamPerformanceData(backendData);
};

export const fetchContests = async (managerId) => {
  return managerApi.getContests(managerId);
};

export const fetchRewardsAudit = async (managerId, filters = {}) => {
  return managerApi.getRewardsAudit(managerId);
};

export const createContest = async (contestData) => {
  return managerApi.createContest(contestData);
};

export const updateContest = async (contestId, contestData) => {
  return managerApi.updateContest(contestId, contestData);
};

export const deleteContest = async (contestId) => {
  return managerApi.deleteContest(contestId);
};

export const sendCoachingAction = async (agentId, actionType) => {
  // This might need a separate endpoint
  return { success: true };
};
