var express = require('express');
var router = express.Router();
const functionaladmin = require('../controller/functionaladmincontroller');
var cors = require('cors');

router.use(cors());

router.post('/functionaladmin', functionaladmin.functionaladmin);



module.exports = router;