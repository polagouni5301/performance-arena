const express = require('express');
const router = express.Router();


const agentRoutes = require('./agent');
const managerRoutes = require('./manager');
const leadershipRoutes = require('./leadership');
const adminRoutes = require('./admin');
const authController = require('../controllers/authController');


router.use('/agent', agentRoutes);
router.use('/manager', managerRoutes);
router.use('/leadership', leadershipRoutes);
router.use('/admin', adminRoutes);


router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

module.exports = router;