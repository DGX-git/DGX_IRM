var express = require('express');
var router = express.Router();
const user = require('../controller/usercontroller');
var cors = require('cors');

router.use(cors());

router.get('/get-user', user.getUser);
    
router.delete('/delete/:id', user.deleteUser);

module.exports = router;