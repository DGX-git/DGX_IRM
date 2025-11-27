var express = require('express');
var router = express.Router();
const user = require('../controller/usercontroller');
var cors = require('cors');

router.use(cors());

router.post('/register', user.saveUser);

router.post('/user', user.user);

module.exports = router;