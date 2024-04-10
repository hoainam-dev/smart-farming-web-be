const TemperatureHumidity = require("../model/tempHumiditymodel");

exports.getLatestTemperatureHumidity = async (req, res) => {
  try {
    const result = await TemperatureHumidity.findOne({})
      .sort({ timestamp: -1 })
      .limit(1);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTemperatureHumidity = async (req, res) => {
  try {
    const results = await TemperatureHumidity.find({})
      .sort({ timestamp: -1 })
      .limit(8);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.countHumidity = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const results = await TemperatureHumidity.aggregate([
      {
        $match: {
          timestamp: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          averageHumidity: { $avg: "$humidity" } // Tính trung bình độ ẩm
        }
      },
      {
        $project: {
          _id: 1,
          averageHumidity: { $round: ["$averageHumidity", 1] } // Làm tròn kết quả đến 1 chữ số thập phân
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the last 7 days." });
    }

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
