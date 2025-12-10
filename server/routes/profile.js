var express = require("express");
var router = express.Router();
const profile = require("../controller/profilecontroller");
var cors = require("cors");

router.use(cors());
// const { authenticateToken } = require('../middleware/auth');

router.get("/getUserProfile", profile.profile);
// Update user profile
router.put("/:userId/updateProfile", profile.updateProfile);
// Update association
router.put("/:associationId/updateAssociation", profile.updateAssociation);
// Update auth user metadata
router.put("/update-user", profile.updateAuthUser);

module.exports = router;
