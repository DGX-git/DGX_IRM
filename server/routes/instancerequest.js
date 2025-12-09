var express = require('express');
var router = express.Router();
const instancerequest = require('../controller/instancerequestcontroller');
var cors = require('cors');

router.use(cors());

router.post('/getInstanceRequestByUserId', instancerequest.getInstanceRequestByUserId);

router.get('/getUserTypes', instancerequest.getUserTypes);

router.get('/getImages', instancerequest.getImages);

router.get('/getCpus', instancerequest.getCpus);

router.get('/getGpus', instancerequest.getGpus);

router.get('/getGpuPartition', instancerequest.getGpuPartition);

router.get('/getRams', instancerequest.getRams);

router.get('/getTimeSlots', instancerequest.getTimeSlots);

router.post('/getUserTimeSlotsByUserId', instancerequest.getUserTimeSlotsByUserId);

router.post('/saveInstanceRequest', instancerequest.saveInstanceRequest);

router.post('/updateInstanceRequest', instancerequest.updateInstanceRequest);

router.post('/deleteInstanceRequest', instancerequest.deleteInstanceRequest);




module.exports = router;