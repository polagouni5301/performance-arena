const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:3000/api';

  try {
    // Test health
    console.log('Testing health endpoint...');
    const health = await axios.get(`${baseURL}/../health`);
    console.log('Health:', health.data);

    // Test agent dashboard
    console.log('\nTesting agent dashboard...');
    const dashboard = await axios.get(`${baseURL}/agent/AGT-001/dashboard`);
    console.log('Dashboard score:', dashboard.data.score);

    // Test manager overview
    console.log('\nTesting manager overview...');
    const overview = await axios.get(`${baseURL}/manager/MGR-001/overview`);
    console.log('Manager team health:', overview.data.teamHealthScore);

    // Test leadership overview
    console.log('\nTesting leadership overview...');
    const leadership = await axios.get(`${baseURL}/leadership/overview`);
    console.log('Leadership performance score:', leadership.data.kpis.performanceScore.value);

    // Test admin overview
    console.log('\nTesting admin overview...');
    const admin = await axios.get(`${baseURL}/admin/overview`);
    console.log('Admin active users:', admin.data.kpis.activeUsers.value);

    console.log('\nAll endpoints tested successfully!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testEndpoints();