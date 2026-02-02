
import { ENDPOINTS } from './endpoints.js';
import http from './http.js';

export const managerApi = {
  /**
   * Get manager overview data
   * @param {string} managerId - Manager ID
   * @returns {Promise} Overview data
   */
  async getOverview(managerId) {
    return http.get(ENDPOINTS.manager.overview(managerId));
  },

  /**
   * Get team performance data
   * @param {string} managerId - Manager ID
   * @returns {Promise} Team performance data
   */
  async getTeamPerformance(managerId) {
    return http.get(ENDPOINTS.manager.teamPerformance(managerId));
  },

  /**
   * Get contests data
   * @param {string} managerId - Manager ID
   * @returns {Promise} Contests data
   */
  async getContests(managerId) {
    return http.get(ENDPOINTS.manager.contests(managerId));
  },

  /**
   * Get rewards audit data
   * @param {string} managerId - Manager ID
   * @returns {Promise} Rewards audit data
   */
  async getRewardsAudit(managerId) {
    return http.get(ENDPOINTS.manager.rewardsAudit(managerId));
  },

  /**
   * Create new contest
   * @param {Object} contestData - Contest data
   * @returns {Promise} Creation result
   */
  async createContest(contestData) {
    return http.post(ENDPOINTS.manager.createContest, contestData);
  },

  /**
   * Update contest
   * @param {string} contestId - Contest ID
   * @param {Object} contestData - Updated contest data
   * @returns {Promise} Update result
   */
  async updateContest(contestId, contestData) {
    return http.put(ENDPOINTS.manager.updateContest(contestId), contestData);
  },

  /**
   * Delete contest
   * @param {string} contestId - Contest ID
   * @returns {Promise} Deletion result
   */
  async deleteContest(contestId) {
    return http.delete(ENDPOINTS.manager.deleteContest(contestId));
  },
};

export default managerApi;