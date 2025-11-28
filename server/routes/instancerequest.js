var express = require('express');
var router = express.Router();
const instancerequest = require('../controller/instancerequestcontroller');
var cors = require('cors');

router.use(cors());

router.post('/instancerequest', instancerequest.instancerequest);

router.get('/getCpu', instancerequest.instancerequest);



module.exports = router;