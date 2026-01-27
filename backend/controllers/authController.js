const guidesService = require('../services/guidesService');
const managerReportingService = require('../services/managerReportingService');
const managerUtilService = require('../services/managerUtilService');
const userService = require('../services/userService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if it's a manager login by manager name
      const managerStructure = managerReportingService.getManagerStructure(email);
      if (managerStructure) {
        // Manager login - simple password check for demo
        if (password === 'manager123') { // Mock password
          // Find the manager user by name to get their user_id
          const managerUser = managerUtilService.findManagerById(email) || 
                             userService.getAllUsers().find(u => u.name === email && u.role === 'manager');
          
          if (!managerUser) {
            return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Manager not found' } });
          }
          
          const managerId = managerUser.user_id;
          const managerDepts = managerUtilService.getManagerDepartments(email);
          const teamSize = managerStructure.totalGuides;
          const registeredGuides = managerStructure.registeredGuides;
          
          res.json({
            token: `mock-jwt-manager-${managerId}`,
            user: {
              id: managerId,
              name: email,
              role: 'manager',
              email: managerUser.email,
              avatar: email.split(' ').map(n => n[0]).join('').toUpperCase(),
              departments: managerDepts,
              teamSize: teamSize,
              registeredGuides: registeredGuides
            }
          });
          return;
        }
      }

      // Check for other user types (leadership, admin, etc.) created through registration
      const user = userService.validateCredentials(email, password);
      if (user) {
        res.json({
          token: `mock-jwt-${user.user_id}`,
          user: {
            id: user.user_id,
            name: user.name,
            role: user.role,
            avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
            department: user.department
          }
        });
        return;
      }

      // Check for guide login (agents)
      const allGuides = guidesService.getAllGuides();
      const guide = allGuides.find(g => g.loginInfo && g.loginInfo.email === email);

      if (guide && guide.registered) {
        // Mock password check
        res.json({
          token: `mock-jwt-${guide.guide_id}`,
          user: {
            id: guide.guide_id,
            name: guide.name,
            role: 'agent',
            avatar: guide.name.split(' ').map(n => n[0]).join(''),
            department: guide.department,
            team: guide.supervisor
          }
        });
      } else {
        res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
      }
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  async register(req, res) {
    try {
      const { name, email, password, role, department, guide_id } = req.body;

      if (role === 'agent') {
        // Agent registration requires guide_id
        if (!guide_id) {
          return res.status(400).json({ error: { code: 'MISSING_GUIDE_ID', message: 'Guide ID is required for agent registration' } });
        }

        const guide = guidesService.getGuide(guide_id);
        if (!guide) {
          return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Guide not found' } });
        }

        if (guide.registered) {
          return res.status(400).json({ error: { code: 'ALREADY_REGISTERED', message: 'Guide already registered' } });
        }

        guidesService.registerGuide(guide_id, { email, password, name: name.trim() });

        res.json({
          message: 'Registration successful',
          user: {
            id: guide_id,
            name: guide.name,
            role: 'agent',
            avatar: guide.name.split(' ').map(n => n[0]).join(''),
            department: guide.department,
            team: guide.supervisor
          }
        });
      } else {
        // Non-agent registration (manager, leadership, admin, etc.)
        try {
          const newUser = userService.createUser({ name, email, password, role, department });

          res.json({
            message: 'Registration successful',
            user: {
              id: newUser.user_id,
              name: newUser.name,
              role: newUser.role,
              avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase(),
              department: newUser.department
            }
          });
        } catch (error) {
          if (error.message === 'User already exists with this email') {
            return res.status(400).json({ error: { code: 'ALREADY_EXISTS', message: 'User already exists with this email' } });
          }
          throw error;
        }
      }
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }
}

module.exports = new AuthController();