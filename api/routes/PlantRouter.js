const express = require('express');
const router = express.Router();
const plantController = require("../controllers/plantsController")

router.post("/create", plantController.create);
router.post("/createCollection/:id", plantController.createCollectionByIdPlant);
router.get("/", plantController.getPlants);
router.post("/update/:id", plantController.updatePlants);
router.post("/delete/:id", plantController.deletePlants);
router.get("/:id", plantController.getPlantDetails);
module.exports = router