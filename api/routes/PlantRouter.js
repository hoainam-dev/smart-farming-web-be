const express = require('express');
const router = express.Router();
const plantController = require("../controllers/plantsController")

router.post("/create", plantController.create);
router.post("/createCollection/:id", plantController.createCollectionByIdPlant);
module.exports = router