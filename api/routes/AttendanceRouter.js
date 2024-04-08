var express = require("express");
var router = express.Router();

const attendanceController = require("../controllers/attendanceController");

router.get("/", attendanceController.getAttendances);
router.get("/:id", attendanceController.getAttendanceDetails);
router.get("/collection/:id", attendanceController.getAttendanceCollection);

module.exports = router;
