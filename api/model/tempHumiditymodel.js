const mongoose = require('mongoose');

const tempHumiditySchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' }, // Thiết bị liên quan đến sự kiện
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

const TemperatureHumidity = mongoose.model('TemperatureHumidity', tempHumiditySchema);

module.exports = TemperatureHumidity;
