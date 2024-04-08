const express = require('express');
const router = express.Router();

const temperatureHumidityController = require('../controllers/tempHumidityController');

router.get('/', temperatureHumidityController.getLatestTemperatureHumidity);
router.get('/temp', temperatureHumidityController.getTemperatureHumidity);

module.exports = router;