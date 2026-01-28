
const express = require('express');
const router = express.Router();
const emailsController = require('../controller/emailscontroller');
var cors = require('cors');

router.use(cors());

router.post('/send-approval-email', emailsController.sendApprovalEmail);
router.post('/send-functional-approval-email', emailsController.sendFunctionalApprovalEmail);
router.post('/send-rejection-email', emailsController.sendRejectionEmail);
router.post('/send-revoke-email', emailsController.sendRevokeEmail);
router.post('/send-grant-access-email', emailsController.sendGrantAccessEmail);

module.exports = router;