var express = require('express');
var router = express.Router();
const instancerequest = require('../controller/instancerequestcontroller');
var cors = require('cors');
var path = require('path');

router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  // router.get('/getCpu', instancerequest.instancerequest);
  // res.render('index', { title: 'Express' });
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
