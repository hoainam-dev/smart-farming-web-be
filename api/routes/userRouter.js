const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")

// router.get("/", userController.getAllUsers);
router.post("/update", userController.updateUserRole);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserDetails);
module.exports = router