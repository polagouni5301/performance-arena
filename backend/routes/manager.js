const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');


router.get('/:managerId/overview', managerController.getOverview);
router.get('/:managerId/team-performance', managerController.getTeamPerformance);
router.get('/:managerId/contests', managerController.getContests);
router.get('/:managerId/rewards-audit', managerController.getRewardsAudit);


router.post('/contests', managerController.createContest);
router.put('/contests/:contestId', managerController.updateContest);
router.delete('/contests/:contestId', managerController.deleteContest);
router.post('/contests/:contestId/publish', managerController.publishContest);

module.exports = router;