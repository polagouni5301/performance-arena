
import { ENDPOINTS } from './endpoints.js';
import http from './http.js';

export const leadershipApi = {
  /**
   * Get leadership overview data
   * @returns {Promise} Overview data
   */
  async getOverview() {
    return http.get(ENDPOINTS.leadership.overview);
  },

  /**
   * Get leaderboards data
   * @param {Object} params - Query parameters
   * @returns {Promise} Leaderboards data
   */
  async getLeaderboards(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.leadership.leaderboards}?${queryString}` : ENDPOINTS.leadership.leaderboards;
    return http.get(endpoint);
  },

  /**
   * Get reports data
   * @param {Object} params - Query parameters
   * @returns {Promise} Reports data
   */
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.leadership.reports}?${queryString}` : ENDPOINTS.leadership.reports;
    return http.get(endpoint);
  },

  /**
   * Get ROI data
   * @param {Object} params - Query parameters
   * @returns {Promise} ROI data
   */
  async getROI(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.leadership.roi}?${queryString}` : ENDPOINTS.leadership.roi;
    return http.get(endpoint);
  },

  /**
   * Export report
   * @param {Object} exportData - Export parameters
   * @returns {Promise} Export result
   */
  async exportReport(exportData) {
    return http.post(ENDPOINTS.leadership.exportReport, exportData);
  },
};

export default leadershipApi;