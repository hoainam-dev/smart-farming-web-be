const express = require('express');
const router = express.Router();

const temperatureHumidityController = require('../controllers/tempHumidityController');

router.get('/', temperatureHumidityController.getLatestTemperatureHumidity);
router.get('/temp', temperatureHumidityController.getTemperatureHumidity);
router.get('/humidity', temperatureHumidityController.countHumidity);

module.exports = router;