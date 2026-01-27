const fs = require('fs');
const path = require('path');

class ContestService {
  constructor() {
    this.contestsPath = path.join(__dirname, '../data/processed/contests.json');
  }

  /**
   * Get all contests
   * @returns {Array} All contests
   */
  getContests() {
    try {
      if (fs.existsSync(this.contestsPath)) {
        return JSON.parse(fs.readFileSync(this.contestsPath, 'utf8'));
      }
      return [];
    } catch (error) {
      console.error('Error reading contests:', error);
      return [];
    }
  }

  /**
   * Get active contests (for agent banner display)
   * @returns {Array} Active contests
   */
  getActiveContests() {
    const contests = this.getContests();
    const now = new Date();
    
    return contests.filter(contest => {
      const startDate = new Date(contest.startDate);
      const endDate = new Date(contest.endDate);
      return contest.status === 'published' && startDate <= now && endDate >= now;
    });
  }

  /**
   * Get upcoming contests
   * @returns {Array} Upcoming contests
   */
  getUpcomingContests() {
    const contests = this.getContests();
    const now = new Date();
    
    return contests.filter(contest => {
      const startDate = new Date(contest.startDate);
      return contest.status === 'published' && startDate > now;
    });
  }

  /**
   * Get contests by creator role
   * @param {string} creatorRole - 'admin' or 'manager'
   * @returns {Array} Contests by role
   */
  getContestsByCreatorRole(creatorRole) {
    const contests = this.getContests();
    return contests.filter(contest => contest.createdByRole === creatorRole);
  }

  /**
   * Get contests by creator ID
   * @param {string} creatorId - Creator user ID
   * @returns {Array} Contests by creator
   */
  getContestsByCreatorId(creatorId) {
    const contests = this.getContests();
    return contests.filter(contest => contest.createdById === creatorId);
  }

  /**
   * Create a new contest
   * @param {Object} contestData - Contest data
   * @param {string} creatorId - Creator user ID
   * @param {string} creatorRole - 'admin' or 'manager'
   * @param {string} creatorName - Creator name
   * @returns {Object} Created contest
   */
  createContest(contestData, creatorId, creatorRole, creatorName) {
    const contests = this.getContests();
    
    const newContest = {
      id: `CONTEST-${Date.now()}`,
      ...contestData,
      createdById: creatorId,
      createdByRole: creatorRole,
      createdByName: creatorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: contestData.status || 'draft',
      participants: [],
      results: null
    };
    
    contests.push(newContest);
    this.saveContests(contests);
    
    return newContest;
  }

  /**
   * Update a contest
   * @param {string} contestId - Contest ID
   * @param {Object} updates - Updates to apply
   * @returns {Object|null} Updated contest or null
   */
  updateContest(contestId, updates) {
    const contests = this.getContests();
    const index = contests.findIndex(c => c.id === contestId);
    
    if (index === -1) {
      return null;
    }
    
    contests[index] = {
      ...contests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveContests(contests);
    return contests[index];
  }

  /**
   * Delete a contest
   * @param {string} contestId - Contest ID
   * @returns {boolean} Success
   */
  deleteContest(contestId) {
    const contests = this.getContests();
    const filtered = contests.filter(c => c.id !== contestId);
    
    if (filtered.length === contests.length) {
      return false;
    }
    
    this.saveContests(filtered);
    return true;
  }

  /**
   * Publish a contest (change status to published)
   * @param {string} contestId - Contest ID
   * @returns {Object|null} Published contest or null
   */
  publishContest(contestId) {
    return this.updateContest(contestId, { status: 'published' });
  }

  /**
   * Save contests to file
   * @param {Array} contests - Contests array
   */
  saveContests(contests) {
    fs.writeFileSync(this.contestsPath, JSON.stringify(contests, null, 2));
  }

  /**
   * Get contest by ID
   * @param {string} contestId - Contest ID
   * @returns {Object|null} Contest or null
   */
  getContestById(contestId) {
    const contests = this.getContests();
    return contests.find(c => c.id === contestId) || null;
  }
}

module.exports = new ContestService();
