
import { ENDPOINTS } from './endpoints.js';
import http from './http.js';

export const authApi = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} User data with token
   */
  async login(credentials) {
    return http.post(ENDPOINTS.auth.login, credentials);
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration result
   */
  async register(userData) {
    return http.post(ENDPOINTS.auth.register, userData);
  },
};

export default authApi;