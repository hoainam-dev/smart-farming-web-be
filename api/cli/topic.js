const DHT = "DHT";
const LED = "LED";
const PAN = "PAN";
const MANUALLY = "MANUALLY";
const FLAME = "FLAME";
const DISTANCE = "DISTANCE";
const RGB = "RGB";
const LIGHT = "Light";


const { admin } = require("../connectFirebase/connect");

exports.topic = async () => {
  const querySnapshot = await admin
    .firestore()
    .collection("devices")
    .select("topic")
    .distinct();

  let topics = [];

  querySnapshot.forEach((doc) => {
    topics.push(doc.data().topic);
  });

  res.status(200).json({
    topics,
  });
};
module.exports = { DHT, LED, PAN, MANUALLY, FLAME, DISTANCE, RGB, LIGHT };
