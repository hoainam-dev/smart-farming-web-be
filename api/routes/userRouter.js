const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")

// router.get("/", userController.getAllUsers);
router.put("/update/:id", userController.updateUserRole);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserDetails);
router.delete("/delete/:id", userController.deleteUser);
module.exports = router