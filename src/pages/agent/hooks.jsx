

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchAgentDashboard,
  fetchAgentPerformance,
  fetchLeaderboard,
  fetchPlayzone,
  fetchRewards,
  fetchAchievements,
  claimScratchCard,
  claimScratchReward,
  spinWheel,
  claimSpinReward,
  redeemReward,
} from './api.js';

/**
 * Hook for Agent Dashboard data
 * @param {string} agentId - Agent identifier
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAgentDashboard = (agentId) => {
  const { user } = useAuth();
  const actualAgentId = agentId || user?.id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!actualAgentId) return;
    
    try {
      setLoading(true);
      const result = await fetchAgentDashboard(actualAgentId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actualAgentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for Agent Performance data
 * @param {string} agentId - Agent identifier
 * @param {Object} filters - Filter options
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAgentPerformance = (agentId, filters = {}) => {
  const { user } = useAuth();
  const actualAgentId = agentId || user?.id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!actualAgentId) return;
    
    try {
      setLoading(true);
      const result = await fetchAgentPerformance(actualAgentId, filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actualAgentId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for Leaderboard data
 * @param {Object} filters - Filter options (viewType, timeRange)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useLeaderboard = (filters = {}) => {
  const { user } = useAuth();
  const agentId = user?.id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!agentId) return;
    
    try {
      setLoading(true);
      const result = await fetchLeaderboard(agentId, filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [agentId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for Play Zone data
 * @param {string} agentId - Agent identifier
 * @returns {Object} { data, loading, error, actions }
 */
export const usePlayzone = (agentId) => {
  const { user } = useAuth();
  const actualAgentId = agentId || user?.id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!actualAgentId) return;
    
    try {
      setLoading(true);
      const result = await fetchPlayzone(actualAgentId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actualAgentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClaimScratch = useCallback(async () => {
    if (!actualAgentId) return;
    
    setActionLoading(true);
    try {
      const result = await claimScratchCard(actualAgentId);
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [actualAgentId]);

  // Claim and record scratch reward to backend
  const handleClaimScratchReward = useCallback(async (rewardData) => {
    if (!actualAgentId) return;
    
    setActionLoading(true);
    try {
      const result = await claimScratchReward(actualAgentId, rewardData);
      await fetchData(); // Refresh data after claiming
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [actualAgentId, fetchData]);

  // Spin wheel with token deduction
  const handleSpin = useCallback(async (tokenCost = 100) => {
    if (!actualAgentId) return;
    
    setActionLoading(true);
    try {
      const result = await spinWheel(actualAgentId, { tokenCost });
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [actualAgentId]);

  // Claim spin reward (record points/xp)
  const handleClaimSpinReward = useCallback(async (rewardData) => {
    if (!actualAgentId) return;
    
    setActionLoading(true);
    try {
      const result = await claimSpinReward(actualAgentId, rewardData);
      await fetchData(); // Refresh data after claiming
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [actualAgentId, fetchData]);

  return {
    data,
    loading,
    error,
    actionLoading,
    refetch: fetchData,
    actions: {
      claimScratch: handleClaimScratch,
      claimScratchReward: handleClaimScratchReward,
      spin: handleSpin,
      claimSpinReward: handleClaimSpinReward,
    },
  };
};

/**
 * Hook for Rewards Vault data
 * @param {string} agentId - Agent identifier
 * @param {Object} filters - Filter options (category)
 * @returns {Object} { data, loading, error, actions }
 */
export const useRewardsVault = (agentId, filters = {}) => {
  const { user } = useAuth();
  const actualAgentId = agentId || user?.id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!actualAgentId) return;
    
    try {
      setLoading(true);
      const result = await fetchRewards(actualAgentId, filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actualAgentId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRedeem = useCallback(async (rewardId) => {
    if (!actualAgentId) return;
    
    setActionLoading(true);
    try {
      const result = await redeemReward(actualAgentId, rewardId);
      await fetchData(); // Refresh data after redemption
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [actualAgentId, fetchData]);

  return {
    data,
    loading,
    error,
    actionLoading,
    refetch: fetchData,
    actions: {
      redeem: handleRedeem,
    },
  };
};

/**
 * Hook for Achievements data
 * @param {string} agentId - Agent identifier
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAchievements = (agentId) => {
  const { user } = useAuth();
  const actualAgentId = agentId || user?.id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!actualAgentId) return;
    
    try {
      setLoading(true);
      const result = await fetchAchievements(actualAgentId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actualAgentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
