const fs = require('fs');
const path = require('path');

class UserService {
  constructor() {
    this.usersFile = path.join(__dirname, '../data/processed/users.json');
    this.users = this.loadUsers();
  }

  loadUsers() {
    if (fs.existsSync(this.usersFile)) {
      return JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
    }
    return [];
  }

  saveUsers() {
    fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
  }

  createUser(userData) {
    const { name, email, password, role, department } = userData;

    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Generate a unique user_id
    const userId = role === 'manager' ? `mgr_${Date.now()}` : `${role}_${Date.now()}`;

    const newUser = {
      user_id: userId,
      name: name.trim(),
      email,
      role,
      department: department || null,
      team_id: null,
      manager_id: null,
      supervisor_id: null,
      avatar_url: null,
      hire_date: new Date().toISOString(),
      rank: 'Bronze',
      status: 'active',
      // Store password hash (in production, this should be properly hashed)
      password: password
    };

    this.users.push(newUser);
    this.saveUsers();

    return newUser;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(userId) {
    return this.users.find(u => u.user_id === userId);
  }

  validateCredentials(email, password) {
    const user = this.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  getAllUsers() {
    return this.users;
  }

  getUsersByRole(role) {
    return this.users.filter(u => u.role === role);
  }
}

module.exports = new UserService();