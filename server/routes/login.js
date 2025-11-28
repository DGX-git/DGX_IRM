var express = require('express');
var router = express.Router();
const login = require('../controller/logincontroller');
var cors = require('cors');

router.use(cors());

router.post('/login', login.login);


module.exports = router;