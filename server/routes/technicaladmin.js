var express = require('express');
var router = express.Router();
const technicaladmin = require('../controller/technicaladmincontroller');
var cors = require('cors');

router.use(cors());

router.post('/technicaladmin', technicaladmin.technicaladmin);


module.exports = router;