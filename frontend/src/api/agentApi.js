

import { ENDPOINTS } from './endpoints.js';
import http from './http.js';

export const agentApi = {
  /**
   * Get agent dashboard data
   * @param {string} agentId - Agent ID
   * @returns {Promise} Dashboard data
   */
  async getDashboard(agentId) {
    return http.get(ENDPOINTS.agent.dashboard(agentId));
  },

  /**
   * Get agent performance data
   * @param {string} agentId - Agent ID
   * @returns {Promise} Performance data
   */
  async getPerformance(agentId) {
    return http.get(ENDPOINTS.agent.performance(agentId));
  },

  /**
   * Get leaderboard data
   * @param {string} agentId - Agent ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Leaderboard data
   */
  async getLeaderboard(agentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.agent.leaderboard(agentId)}?${queryString}` : ENDPOINTS.agent.leaderboard(agentId);
    return http.get(endpoint);
  },

  /**
   * Get playzone data
   * @param {string} agentId - Agent ID
   * @returns {Promise} Playzone data
   */
  async getPlayzone(agentId) {
    return http.get(ENDPOINTS.agent.playzone(agentId));
  },

  /**
   * Get achievements data
   * @param {string} agentId - Agent ID
   * @returns {Promise} Achievements data
   */
  async getAchievements(agentId) {
    return http.get(ENDPOINTS.agent.achievements(agentId));
  },

  /**
   * Get rewards vault data
   * @param {string} agentId - Agent ID
   * @returns {Promise} Rewards vault data
   */
  async getRewardsVault(agentId) {
    return http.get(ENDPOINTS.agent.rewardsVault(agentId));
  },

  /**
   * Reveal scratch card
   * @param {string} agentId - Agent ID
   * @returns {Promise} Scratch result
   */
  async scratchCard(agentId) {
    return http.post(ENDPOINTS.agent.scratchCard(agentId));
  },

  /**
   * Claim scratch card reward - records points to backend
   * @param {string} agentId - Agent ID
   * @param {Object} rewardData - { reward: string, points: number }
   * @returns {Promise} Claim result with updated balance
   */
  async claimScratchReward(agentId, rewardData) {
    return http.post(ENDPOINTS.agent.claimScratchReward(agentId), rewardData);
  },

  /**
   * Spin the wheel - deducts tokens from balance
   * @param {string} agentId - Agent ID
   * @param {Object} spinData - { tokenCost: number }
   * @returns {Promise} Spin result with reward and new balance
   */
  async spinWheel(agentId, spinData = { tokenCost: 100 }) {
    return http.post(ENDPOINTS.agent.spinWheel(agentId), spinData);
  },

  /**
   * Claim spin wheel reward - records points/xp to backend
   * @param {string} agentId - Agent ID
   * @param {Object} rewardData - { reward: { label, sublabel, points, xp } }
   * @returns {Promise} Claim result with updated balance
   */
  async claimSpinReward(agentId, rewardData) {
    return http.post(ENDPOINTS.agent.claimSpinReward(agentId), rewardData);
  },

  /**
   * Accept challenge
   * @param {string} agentId - Agent ID
   * @param {string} challengeId - Challenge ID
   * @returns {Promise} Acceptance result
   */
  async acceptChallenge(agentId, challengeId) {
    return http.post(ENDPOINTS.agent.acceptChallenge(agentId, challengeId));
  },
};

export default agentApi;