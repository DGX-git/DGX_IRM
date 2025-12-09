var express = require("express");
var router = express.Router();
const registerController = require("../controller/registercontroller");
var cors = require("cors");

router.use(cors());

router.post("/createUser", registerController.createUser);
router.get("/getInstitutes", registerController.getInstitutes);
router.get("/:instituteId/getDepartments", registerController.getDepartments);
router.get("/getRoles", registerController.getRoles);

module.exports = router;
