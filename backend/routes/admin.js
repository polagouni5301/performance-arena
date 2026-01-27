const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const uploadController = require('../controllers/uploadController');


router.get('/overview', adminController.getOverview);
router.get('/metrics', adminController.getMetrics);
router.get('/points-rules', adminController.getPointsRules);
router.get('/rewards-catalog', adminController.getRewardsCatalog);
router.get('/audit-logs', adminController.getAuditLogs);


router.post('/metrics', adminController.createMetric);
router.put('/metrics/:metricId', adminController.updateMetric);
router.delete('/metrics/:metricId', adminController.deleteMetric);


router.put('/points-rules', adminController.updatePointsRules);
router.post('/points-rules/simulate', adminController.simulatePointsRules);


router.post('/rewards-catalog', adminController.createReward);
router.put('/rewards-catalog/:rewardId', adminController.updateReward);
router.delete('/rewards-catalog/:rewardId', adminController.deleteReward);
router.patch('/rewards-catalog/:rewardId/stock', adminController.updateStock);


router.patch('/audit-logs/triggers/:triggerName', adminController.toggleEmailTrigger);
router.get('/audit-logs/export/:reportType', adminController.exportAuditReport);


router.get('/contests', adminController.getContests);
router.get('/contests/active', adminController.getActiveContests);
router.post('/contests', adminController.createContest);
router.put('/contests/:contestId', adminController.updateContest);
router.delete('/contests/:contestId', adminController.deleteContest);
router.post('/contests/:contestId/publish', adminController.publishContest);


router.post('/upload', uploadController.uploadDataFile.bind(uploadController));
router.get('/uploads', uploadController.getUploadedFiles.bind(uploadController));
router.delete('/uploads/:filename', uploadController.deleteFile.bind(uploadController));

module.exports = router;