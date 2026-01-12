const express = require('express');
const router = express.Router();
const technicalAdminController = require('../controller/technicaladmincontroller');
var cors = require('cors');

router.use(cors());

// Instance request routes
router.post('/filtered-requests', technicalAdminController.getFilteredRequests);
router.put('/instance-request', technicalAdminController.updateInstanceRequest);
router.delete('/user-time-slots/:instance_request_id', technicalAdminController.deleteUserTimeSlots);
router.get('/time-slots', technicalAdminController.getTimeSlots);
router.get('/user-time-slots', technicalAdminController.getUserTimeSlots);
router.get("/masters", technicalAdminController.getMasters);
router.post('/approve-request', technicalAdminController.approveRequest);
router.post('/reject-request', technicalAdminController.rejectRequest);
router.post('/grant-access', technicalAdminController.grantAccess);
router.post('/revoke-access', technicalAdminController.revokeAccess);
router.get('/status', technicalAdminController.getStatus);
router.get('/user-institutes/:userId', technicalAdminController.getUserInstitutes);
router.get('/users', technicalAdminController.getUsers);
router.get('/associations', technicalAdminController.getAssociations);
router.get('/institutes', technicalAdminController.getInstitutes);


module.exports = router;