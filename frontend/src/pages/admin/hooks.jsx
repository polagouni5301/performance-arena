/**
 * Admin Hooks
 * Custom hooks for data fetching in Admin role pages.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminOverview,
  fetchMetrics,
  updateMetric,
  createMetric,
  fetchPointsRules,
  updatePointsRules,
  fetchRewardsCatalog,
  createReward,
  updateReward,
  fetchAuditLogs,
  updateEmailTrigger,
} from './api';

export const useAdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchAdminOverview();
      setData(result);
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

export const useMetrics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchMetrics();
      setData(result);
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

  const handleUpdate = useCallback(async (metricId, metricData) => {
    const result = await updateMetric(metricId, metricData);
    await fetchData();
    return result;
  }, [fetchData]);

  const handleCreate = useCallback(async (metricData) => {
    const result = await createMetric(metricData);
    await fetchData();
    return result;
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    actions: { update: handleUpdate, create: handleCreate },
  };
};

export const usePointsRules = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchPointsRules();
      setData(result);
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

  const handleSave = useCallback(async (rulesData) => {
    setSaving(true);
    try {
      const result = await updatePointsRules(rulesData);
      await fetchData();
      return result;
    } finally {
      setSaving(false);
    }
  }, [fetchData]);

  return {
    data,
    loading,
    saving,
    error,
    refetch: fetchData,
    actions: { save: handleSave },
  };
};

export const useRewardsCatalog = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchRewardsCatalog(filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = useCallback(async (rewardData) => {
    const result = await createReward(rewardData);
    await fetchData();
    return result;
  }, [fetchData]);

  const handleUpdate = useCallback(async (rewardId, rewardData) => {
    const result = await updateReward(rewardId, rewardData);
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

export const useAuditLogs = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchAuditLogs(filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleTrigger = useCallback(async (triggerId, enabled) => {
    const result = await updateEmailTrigger(triggerId, enabled);
    await fetchData();
    return result;
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    actions: { toggleTrigger: handleToggleTrigger },
  };
};
