
import { useState, useEffect, useCallback } from 'react';
import {
  fetchLeadershipOverview,
  fetchLeadershipLeaderboards,
  fetchLeadershipReports,
  fetchLeadershipROI,
  exportReport,
} from './api';

export const useLeadershipOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchLeadershipOverview();
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

export const useLeadershipLeaderboards = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchLeadershipLeaderboards(filters);
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

  return { data, loading, error, refetch: fetchData };
};

export const useLeadershipReports = (activeTab = 'Revenue') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchLeadershipReports(activeTab);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = useCallback(async (reportType, format) => {
    return await exportReport(reportType, format);
  }, []);

  return { data, loading, error, refetch: fetchData, actions: { export: handleExport } };
};

export const useLeadershipROI = (fiscalYear = 'FY2024') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchLeadershipROI(fiscalYear);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fiscalYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = useCallback(async (format) => {
    return await exportReport('roi', format);
  }, []);

  return { data, loading, error, refetch: fetchData, actions: { export: handleExport } };
};
