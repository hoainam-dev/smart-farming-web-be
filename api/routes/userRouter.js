const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const middleware = require("../middleware/middleware")

// router.get("/", userController.getAllUsers);
router.put("/update/:id",middleware.checkRoleAdmin, userController.updateUserRole);
router.get("/", middleware.checkRoleAdmin,userController.getUsers);
router.get("/:id", userController.getUserDetails);
router.delete("/delete/:id", userController.deleteUser);
module.exports = router