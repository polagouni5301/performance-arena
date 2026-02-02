
import { ENDPOINTS } from './endpoints.js';
import http from './http.js';

export const adminApi = {
  /**
   * Get admin overview data
   * @returns {Promise} Overview data
   */
  async getOverview() {
    return http.get(ENDPOINTS.admin.overview);
  },

  /**
   * Get metrics data
   * @returns {Promise} Metrics data
   */
  async getMetrics() {
    return http.get(ENDPOINTS.admin.metrics);
  },

  /**
   * Create new metric
   * @param {Object} metricData - Metric data
   * @returns {Promise} Creation result
   */
  async createMetric(metricData) {
    return http.post(ENDPOINTS.admin.createMetric, metricData);
  },

  /**
   * Update metric
   * @param {string} metricId - Metric ID
   * @param {Object} metricData - Updated metric data
   * @returns {Promise} Update result
   */
  async updateMetric(metricId, metricData) {
    return http.put(ENDPOINTS.admin.updateMetric(metricId), metricData);
  },

  /**
   * Delete metric
   * @param {string} metricId - Metric ID
   * @returns {Promise} Deletion result
   */
  async deleteMetric(metricId) {
    return http.delete(ENDPOINTS.admin.deleteMetric(metricId));
  },

  /**
   * Get points rules data
   * @returns {Promise} Points rules data
   */
  async getPointsRules() {
    return http.get(ENDPOINTS.admin.pointsRules);
  },

  /**
   * Update points rules
   * @param {Object} rulesData - Rules data
   * @returns {Promise} Update result
   */
  async updatePointsRules(rulesData) {
    return http.put(ENDPOINTS.admin.updatePointsRules, rulesData);
  },

  /**
   * Simulate points rules
   * @param {Object} simulationData - Simulation data
   * @returns {Promise} Simulation result
   */
  async simulatePointsRules(simulationData) {
    return http.post(ENDPOINTS.admin.simulatePointsRules, simulationData);
  },

  /**
   * Get rewards catalog data
   * @param {Object} params - Query parameters
   * @returns {Promise} Rewards catalog data
   */
  async getRewardsCatalog(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.admin.rewardsCatalog}?${queryString}` : ENDPOINTS.admin.rewardsCatalog;
    return http.get(endpoint);
  },

  /**
   * Create new reward
   * @param {Object} rewardData - Reward data
   * @returns {Promise} Creation result
   */
  async createReward(rewardData) {
    return http.post(ENDPOINTS.admin.createReward, rewardData);
  },

  /**
   * Update reward
   * @param {string} rewardId - Reward ID
   * @param {Object} rewardData - Updated reward data
   * @returns {Promise} Update result
   */
  async updateReward(rewardId, rewardData) {
    return http.put(ENDPOINTS.admin.updateReward(rewardId), rewardData);
  },

  /**
   * Delete reward
   * @param {string} rewardId - Reward ID
   * @returns {Promise} Deletion result
   */
  async deleteReward(rewardId) {
    return http.delete(ENDPOINTS.admin.deleteReward(rewardId));
  },

  /**
   * Update reward stock
   * @param {string} rewardId - Reward ID
   * @param {Object} stockData - Stock data
   * @returns {Promise} Update result
   */
  async updateStock(rewardId, stockData) {
    return http.put(ENDPOINTS.admin.updateStock(rewardId), stockData);
  },

  /**
   * Get audit logs data
   * @param {Object} params - Query parameters
   * @returns {Promise} Audit logs data
   */
  async getAuditLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.admin.auditLogs}?${queryString}` : ENDPOINTS.admin.auditLogs;
    return http.get(endpoint);
  },

  /**
   * Toggle email trigger
   * @param {string} triggerName - Trigger name
   * @param {Object} triggerData - Trigger data
   * @returns {Promise} Toggle result
   */
  async toggleEmailTrigger(triggerName, triggerData) {
    return http.patch(ENDPOINTS.admin.toggleTrigger(triggerName), triggerData);
  },

  /**
   * Export audit report
   * @param {string} reportType - Report type
   * @returns {Promise} Export result
   */
  async exportAuditReport(reportType) {
    return http.get(ENDPOINTS.admin.exportAudit(reportType));
  },

  /**
   * Get all contests
   * @returns {Promise} Contests data
   */
  async getContests() {
    return http.get(ENDPOINTS.admin.contests);
  },

  /**
   * Get active contests
   * @returns {Promise} Active contests
   */
  async getActiveContests() {
    return http.get(ENDPOINTS.admin.activeContests);
  },

  /**
   * Create a new contest
   * @param {Object} contestData - Contest data
   * @returns {Promise} Creation result
   */
  async createContest(contestData) {
    return http.post(ENDPOINTS.admin.createContest, contestData);
  },

  /**
   * Update a contest
   * @param {string} contestId - Contest ID
   * @param {Object} contestData - Updated contest data
   * @returns {Promise} Update result
   */
  async updateContest(contestId, contestData) {
    return http.put(ENDPOINTS.admin.updateContest(contestId), contestData);
  },

  /**
   * Delete a contest
   * @param {string} contestId - Contest ID
   * @returns {Promise} Deletion result
   */
  async deleteContest(contestId) {
    return http.delete(ENDPOINTS.admin.deleteContest(contestId));
  },

  /**
   * Publish a contest
   * @param {string} contestId - Contest ID
   * @returns {Promise} Publish result
   */
  async publishContest(contestId) {
    return http.post(ENDPOINTS.admin.publishContest(contestId));
  },

  /**
   * Upload data file (Excel/CSV)
   * @param {File} file - File to upload
   * @param {string} folder - Target folder (processed/raw)
   * @returns {Promise} Upload result
   */
  async uploadDataFile(file, folder = 'processed') {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/admin/upload?folder=${folder}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }
    
    return response.json();
  },

  /**
   * Get list of uploaded files
   * @returns {Promise} List of uploaded files
   */
  async getUploadedFiles() {
    return http.get('/admin/uploads');
  },

  /**
   * Delete an uploaded file
   * @param {string} filename - Filename to delete
   * @param {string} folder - Folder containing the file
   * @returns {Promise} Deletion result
   */
  async deleteUploadedFile(filename, folder = 'processed') {
    return http.delete(`/admin/uploads/${filename}?folder=${folder}`);
  },
};

export default adminApi;