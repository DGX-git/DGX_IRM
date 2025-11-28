var express = require('express');
var router = express.Router();
const profile = require('../controller/profilecontroller');
var cors = require('cors');

router.use(cors());

router.post('/profile', profile.profile);


module.exports = router;