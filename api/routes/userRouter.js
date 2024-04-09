const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")

router.get("/", userController.getAllUsers);
router.post("/update", userController.updateUserRole);
module.exports = router