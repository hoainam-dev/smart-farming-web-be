const mqtt = require("mqtt");
const  {DHT,DISTANCE,FLAME,LIGHT} = require("./topic");
const { admin } = require("../connectFirebase/connect");

require("dotenv").config();

const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST;
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT;
const MQTT_BROKER_PROTOCOL = process.env.MQTT_BROKER_PROTOCOL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const options = {
  host: MQTT_BROKER_HOST,
  port: MQTT_BROKER_PORT,
  protocol: MQTT_BROKER_PROTOCOL,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
};
const client = mqtt.connect(options);

const connect = async () => {
  // console.log(topics[1]);
  try {
    
    client.on("error", function (error) {
      console.log(error);
    });
    // Sự kiện khi kết nối thành công
    client.on("connect", () => {
      console.log("Đã kết nối thành công đến MQTT Broker");
    });
    client.on("close", () => {
      console.log("Kết nối đã đóng");
    });
  } catch (err) {
    console.log(err);
  }
};

//dùng để cập nhật status -> file deviceController
const publishManuallyStatus = async (topic, deviceId, status) => {
  const message = status === "ON" ? "ON" : "OFF";
  client.publish(topic, message, { qos: 1, retain: true });
  
  console.log(`Đã publish trạng thái  ${deviceId}: ${topic}`);
};
const publishAutoStatus = async (topic, deviceId, status) => {
  const message = status === "Auto" ? "Auto" : "Manual";
  client.publish(topic, message, { qos: 1, retain: true });
  
  console.log(`Đã publish trạng thái  ${deviceId}: ${topic}`);
};
const publishRGB = async (topic, deviceId, Hex) => {
  const message = Hex;
  client.publish(topic, message, { qos: 1, retain: true });
  
  console.log(`Đã publish trạng thái  ${deviceId}: ${topic}`);
};
const publishtempFan = async (topic, deviceId, temp) => {
  console.log("this is teamp " + temp);
  const message = JSON.stringify(temp);
  client.publish(topic, message, { qos: 1, retain: true });
  
  console.log(`Đã publish trạng thái  ${deviceId}: ${topic}`);
};
module.exports = { connect, client, publishManuallyStatus,publishRGB,publishtempFan,publishAutoStatus };
