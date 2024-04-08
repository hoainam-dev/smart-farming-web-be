const TemperatureHumidity = require('../model/tempHumiditymodel');

exports.getLatestTemperatureHumidity = async (req, res) => {
  try {
    const result = await TemperatureHumidity.findOne({})
      .sort({ timestamp: -1 })
      .limit(1);
    
    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.getTemperatureHumidity = async (req, res) => {
  try {
    const results = await TemperatureHumidity.find({})
      .sort({ timestamp: -1 }) 
      .limit(8);
    
    res.json(results);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
