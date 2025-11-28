var express = require('express');
var router = express.Router();
const register = require('../controller/registercontroller');
var cors = require('cors');

router.use(cors());

router.post('/register', register.register);



module.exports = router;