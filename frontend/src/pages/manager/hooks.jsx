/**
 * Manager Hooks
 * Custom hooks for data fetching in Manager role pages.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchManagerOverview,
  fetchTeamPerformance,
  fetchContests,
  fetchRewardsAudit,
  createContest,
  updateContest,
  sendCoachingAction,
} from './api';

export const useManagerOverview = (managerId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchManagerOverview(managerId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    if (managerId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, managerId]);

  return { data, loading, error, refetch: fetchData };
};

export const useTeamPerformance = (managerId, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchTeamPerformance(managerId, filters);
      setData(result);
      if (result.agents?.length > 0 && !selectedAgent) {
        setSelectedAgent(result.agents[1]); // Default to second agent
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [managerId, JSON.stringify(filters)]);

  useEffect(() => {
    if (managerId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, managerId]);

  const handleCoaching = useCallback(async (agentId, actionType) => {
    return await sendCoachingAction(agentId, actionType);
  }, []);

  return {
    data,
    loading,
    error,
    selectedAgent,
    setSelectedAgent,
    refetch: fetchData,
    actions: { sendCoaching: handleCoaching },
  };
};

export const useContests = (managerId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchContests(managerId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    if (managerId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, managerId]);

  const handleCreate = useCallback(async (contestData) => {
    const result = await createContest(contestData);
    await fetchData();
    return result;
  }, [fetchData]);

  const handleUpdate = useCallback(async (contestId, contestData) => {
    const result = await updateContest(contestId, contestData);
    await fetchData();
    return result;
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    actions: { create: handleCreate, update: handleUpdate },
  };
};

export const useRewardsAudit = (managerId, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchRewardsAudit(managerId, filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [managerId, JSON.stringify(filters)]);

  useEffect(() => {
    if (managerId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, managerId]);

  return { data, loading, error, refetch: fetchData };
};

// Additional hooks for remaining manager pages

export const useMyTeam = (teamId = 'alpha') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Uses team performance mock which includes agents
      const result = await fetchTeamPerformance(teamId);
      // Transform to team member format
      const teamMembers = result.agents?.map((agent, idx) => ({
        id: idx + 1,
        name: agent.name,
        role: agent.role,
        email: `${agent.name.toLowerCase().replace(' ', '.')}@company.com`,
        avatar: agent.avatar,
        status: idx % 3 === 0 ? 'online' : idx % 3 === 1 ? 'away' : 'offline',
        performance: Math.round((agent.qa?.value || 80) + (Math.random() * 10 - 5)),
        trend: idx % 3 === 0 ? 'up' : idx % 3 === 1 ? 'down' : 'stable',
        calls: Math.floor(150 + Math.random() * 100),
        aht: `${Math.floor(4 + Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        nps: Math.floor(70 + Math.random() * 25),
      })) || [];
      setData({ teamMembers });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, selectedMember, setSelectedMember, refetch: fetchData };
};

export const useManagerLeaderboard = (sortBy = 'points', timeRange = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchTeamPerformance('alpha');
      // Transform agents to leaderboard format
      const leaderboard = result.agents?.map((agent, idx) => ({
        rank: idx + 1,
        name: agent.name,
        dept: agent.role.includes('Senior') ? 'Sales' : 'Support',
        points: Math.floor(10000 + Math.random() * 3000),
        revenue: Math.floor(25000 + Math.random() * 25000),
        nps: Math.floor(75 + Math.random() * 20),
        trend: idx % 3 === 0 ? 0 : idx % 2 === 0 ? 2 : -1,
        avatar: agent.avatar,
        streak: Math.floor(2 + Math.random() * 10),
      })).sort((a, b) => b.points - a.points) || [];
      setData({ leaderboard });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sortBy, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useManagerReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Simulated reports data
      const reports = [
        { title: "Weekly Performance Summary", description: "Team metrics, individual scores, and trend analysis", type: "Performance", lastGenerated: "2 hours ago", icon: "BarChart3", color: "primary" },
        { title: "Rewards Distribution Report", description: "Points allocation, redemptions, and budget usage", type: "Rewards", lastGenerated: "1 day ago", icon: "Trophy", color: "accent" },
        { title: "Contest Results Analysis", description: "Competition outcomes, participation rates, and ROI", type: "Contests", lastGenerated: "3 days ago", icon: "PieChart", color: "secondary" },
        { title: "Team Engagement Metrics", description: "Activity levels, feature usage, and engagement scores", type: "Engagement", lastGenerated: "5 days ago", icon: "Users", color: "success" },
        { title: "Monthly Trend Report", description: "Month-over-month performance comparisons", type: "Trends", lastGenerated: "1 week ago", icon: "TrendingUp", color: "warning" },
      ];
      const scheduledReports = [
        { name: "Weekly Summary", schedule: "Every Monday, 9:00 AM", recipients: 5 },
        { name: "Daily Metrics", schedule: "Every day, 6:00 PM", recipients: 3 },
        { name: "Monthly Review", schedule: "1st of each month", recipients: 8 },
      ];
      setData({ reports, scheduledReports });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
