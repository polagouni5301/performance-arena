const kpiService = require('../services/kpiService');
const scoreService = require('../services/scoreService');
const roleService = require('../services/roleService');

describe('KPIService', () => {
  test('should calculate KPI scores for a user', () => {
    const result = kpiService.calculateKPIScores('AGT-001');
    expect(result).toHaveProperty('userId', 'AGT-001');
    expect(result).toHaveProperty('overallScore');
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  test('should return correct status for scores', () => {
    expect(kpiService.getStatus(95)).toBe('excellent');
    expect(kpiService.getStatus(85)).toBe('on-track');
    expect(kpiService.getStatus(65)).toBe('at-risk');
    expect(kpiService.getStatus(45)).toBe('critical');
  });
});

describe('ScoreService', () => {
  test('should calculate leaderboard', () => {
    const leaderboard = scoreService.calculateLeaderboard();
    expect(Array.isArray(leaderboard)).toBe(true);
    if (leaderboard.length > 0) {
      expect(leaderboard[0]).toHaveProperty('rank');
      expect(leaderboard[0]).toHaveProperty('score');
    }
  });
});

describe('RoleService', () => {
  test('should get agent data', () => {
    const data = roleService.getRoleData('agent', 'AGT-001');
    expect(data).toHaveProperty('role', 'agent');
    expect(data).toHaveProperty('kpiScores');
    expect(data).toHaveProperty('gamification');
  });

  test('should get manager data', () => {
    const data = roleService.getRoleData('manager', 'MGR-001');
    expect(data).toHaveProperty('role', 'manager');
    expect(data).toHaveProperty('teamAggregation');
  });

  test('should get leadership data', () => {
    const data = roleService.getRoleData('leadership', 'dummy');
    expect(data).toHaveProperty('role', 'leadership');
    expect(data).toHaveProperty('orgAggregation');
  });

  test('should get admin data', () => {
    const data = roleService.getRoleData('admin', 'dummy');
    expect(data).toHaveProperty('role', 'admin');
    expect(data).toHaveProperty('overview');
  });
});