const express = require('express');
const router = express.Router();
const plantController = require("../controllers/plantsController")
const middleWare = require("../middleware/middleware")
router.post("/create", middleWare.checkRoleAdmin,plantController.create);
router.post("/createCollection/:id", middleWare.checkRoleAdmin,plantController.createCollectionByIdPlant);
router.get("/", plantController.getPlants);
router.post("/update/:id",middleWare.checkRoleAdmin, plantController.updatePlants);
router.delete("/delete/:id", middleWare.checkRoleAdmin,plantController.deletePlants);
router.get("/:id", plantController.getPlantDetails);
router.get("/getCollection/:id", plantController.getPlantByCollection);
router.get("/getAllCollection/:id", plantController.getAllCollectionbyIdPlant);
module.exports = router