const request = require('supertest');
const app = require('../app');

describe('API Integration Tests', () => {
  test('GET /health should return OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
  });

  test('GET /api/agent/:id/dashboard should return dashboard data', async () => {
    const response = await request(app).get('/api/agent/AGT-001/dashboard');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('score');
    expect(response.body).toHaveProperty('metrics');
  });

  test('GET /api/manager/:id/overview should return overview data', async () => {
    const response = await request(app).get('/api/manager/MGR-001/overview');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('teamName');
    expect(response.body).toHaveProperty('teamHealthScore');
  });

  test('GET /api/leadership/overview should return leadership data', async () => {
    const response = await request(app).get('/api/leadership/overview');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('kpis');
  });

  test('GET /api/admin/overview should return admin data', async () => {
    const response = await request(app).get('/api/admin/overview');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('kpis');
  });

  test('POST /api/auth/login should return token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('POST /api/auth/register should register a manager', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Manager',
        email: 'testmanager@example.com',
        password: 'password123',
        role: 'manager',
        department: 'Sales'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('role', 'manager');
  });

  test('POST /api/auth/register should register an admin', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'admin',
        department: 'IT'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('role', 'admin');
  });

  test('POST /api/auth/register should fail for duplicate email', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
        role: 'leadership',
        department: 'Operations'
      });

    // Second registration with same email should fail
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'duplicate@example.com',
        password: 'password123',
        role: 'leadership',
        department: 'Operations'
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'ALREADY_EXISTS');
  });
});