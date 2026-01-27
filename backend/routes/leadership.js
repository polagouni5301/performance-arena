const express = require('express');
const router = express.Router();
const leadershipController = require('../controllers/leadershipController');

// Leadership routes
router.get('/overview', leadershipController.getOverview);
router.get('/leaderboards', leadershipController.getLeaderboards);
router.get('/reports', leadershipController.getReports);
router.get('/roi', leadershipController.getROI);

// POST for export
router.post('/reports/export', leadershipController.exportReport);

module.exports = router;