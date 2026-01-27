const agentController = require('../../controllers/agentController');

describe('AgentController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { agentId: 'AGT-001' },
      query: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  test('getDashboard should return dashboard data', async () => {
    await agentController.getDashboard(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
    const response = mockRes.json.mock.calls[0][0];
    expect(response).toHaveProperty('score');
    expect(response).toHaveProperty('xp');
    expect(response).toHaveProperty('streak');
    expect(response).toHaveProperty('metrics');
    expect(response).toHaveProperty('leaderboard');
    expect(response).toHaveProperty('gamification');
  });

  test('getPerformance should return performance data', async () => {
    await agentController.getPerformance(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
    const response = mockRes.json.mock.calls[0][0];
    expect(response).toHaveProperty('agent');
    expect(response).toHaveProperty('weeklyData');
    expect(response).toHaveProperty('metrics');
    expect(response).toHaveProperty('pointsLog');
  });
});