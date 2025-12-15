var express = require('express');
var router = express.Router();
const functionaladmin = require('../controller/functionaladmincontroller');
var cors = require('cors');

router.use(cors());

router.post('/approve-functional', functionaladmin.approveFunctional);

router.post('/reject-request', functionaladmin.rejectRequest);


module.exports = router;