var express = require("express");
var router = express.Router();
const middleware = require("../middleware/middleware");
const authController = require("../controllers/authController");
router.post("/register", middleware.checkRoleAdmin,authController.register);
router.post("/login", authController.login);
module.exports = router;