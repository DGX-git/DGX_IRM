var express = require("express");
var router = express.Router();
const login = require("../controller/logincontroller");
var cors = require("cors");

router.use(cors());

router.post("/checkEmail", login.checkEmail);
router.post("/send-otp", login.signin);
router.post("/verify-otp", login.verifyOtp);
router.post("/sign-out", login.signOut);

module.exports = router;
