var express = require("express");
var router = express.Router();

const deviceController = require("../controllers/deviceController");
const middleware = require("../middleware/middleware");

router.get("/", deviceController.getDevices);
router.get("/:id", deviceController.getDeviceDetails);
router.post("/create", middleware.checkRoleAdmin,deviceController.create);
router.put("/update/:id", deviceController.update);
router.put("/manually/:id", middleware.checkRoleUser,deviceController.updateManuallyStatus);
router.put("/rgb/:id", deviceController.updateRGB);
router.put("/tempFan/:id", deviceController.updateTempFan);
router.delete("/:id", deviceController.remove);
router.get("/collection/:id", deviceController.getDeviceCollection);
router.put("/collection/update/:id", deviceController.updateDeviceCollection);

module.exports = router;
