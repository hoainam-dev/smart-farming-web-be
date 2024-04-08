const { client, connect } = require("./publisher");
const { admin } = require("../connectFirebase/connect");
const { DHT } = require("./topic");

// connect()
const devicesRef = admin.firestore().collection("devices");
async function subscriber() {
  const querySnapshot = await admin.firestore().collection("devices").get();
  let topics = [];

  querySnapshot.forEach((doc) => {
    topics.push(doc.data().topic);
  });
  client.subscribe(topics, () => {
    console.log(`Subscribe to topic ${topics}`);
  });
  client.subscribe(DHT, () => {
    console.log(`Subscribe to topic ${DHT}`);
  });
  client.on("message", async (receivedTopic, message) => {
    if (receivedTopic === DHT) {
      // Chuyển đổi thông điệp từ dạng chuỗi thành một đối tượng dữ liệu
      const messageString = message.toString();
      const data = parseTemperatureAndHumidity(messageString);

      // Kiểm tra xem có dữ liệu hợp lệ
      if (data) {
        const { temperature, humidity, deviceId } = data;

        // Tìm phòng chứa thiết bị có deviceId tương ứng
        try {
          const device = await Device.findOne({ "devices.id": deviceId });
          if (device) {
            console.log(
              `Temperature: ${temperature}, Humidity: ${humidity}, device: ${device.name}`
            );
            // Lưu dữ liệu vào MongoDB
            const tempHumidityData = new TempHumidity({
              temperature,
              humidity,
              deviceId: device.id,
              timestamp: new Date(),
            });
            tempHumidityData
              .save()
              .then(() => {
                console.log("Dữ liệu đã được lưu vào MongoDB");
              })
              .catch((error) => {
                console.error("Lỗi khi lưu dữ liệu vào MongoDB:", error);
              });
          } else {
            console.error(
              `Không tìm thấy phòng cho thiết bị có deviceId: ${deviceId}`
            );
          }
        } catch (error) {
          console.error("Lỗi khi tìm kiếm phòng trong MongoDB:", error);
        }
      } else {
        console.error("Dữ liệu không hợp lệ:", messageString);
      }
    }
  });
  client.on("message", async (topic, message) => {
    const checkTopic = topics.filter((e) => e === topic).toString();
    if (topic === checkTopic) {
      const messageString = message.toString();
      // Query Firestore for documents with the topic 'light'
      const querySnapshot = await devicesRef
        .where("topic", "==", checkTopic)
        .where("topic", "!=", "RGB")
        .get();
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      // duyệt trong mảng láy id
      querySnapshot.forEach((doc) => {
        const deviceRef = devicesRef.doc(doc.id);
        //messageString là mqtt truyền về , status dựa vào giá trị mqtt
        const status = messageString === "ON" ? "ON" : "OFF";
        deviceRef
          .update({ status: status })
          .then(() => {
            console.log("Update success");
          })
          .catch((err) => {
            console.error("Error updating", err);
          });
      });
    }
  });
  client.on("message", async (topic, message) => {
    if (topic == "RGB" ) {
      const  messageString = message.toString();
      const querySnapshot = await devicesRef.where("topic", "==", "RGB").get();
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      querySnapshot.forEach((doc) => {
        const deviceRef = devicesRef.doc(doc.id);
        
        // Xác định giá trị mới cho các trường Hex và status
        const newHex = messageString !== "ON" && messageString !== "OFF" ? `#${messageString}` : doc.data().Hex;
        const newStatus = messageString === "ON" || messageString === "OFF" ? messageString : doc.data().status;
      
        // Cập nhật tài liệu
        deviceRef.update({
          Hex: newHex,
          status: newStatus
        })
        .then(() => {
          console.log("Update success");
        })
        .catch((err) => {
          console.error("Error updating", err);
        });
      });
    }
  });
}

function parseTemperatureAndHumidity(messageString) {
  const temperatureRegex = /Temperature: (\d+\.\d+)°C/i;
  const humidityRegex = /Humidity: (\d+)%/i;

  const temperatureMatch = messageString.match(temperatureRegex);
  const humidityMatch = messageString.match(humidityRegex);

  if (temperatureMatch && humidityMatch) {
    const temperature = parseFloat(temperatureMatch[1]);
    const humidity = parseInt(humidityMatch[1]);
    return { temperature, humidity };
  }

  return null; // Trả về null nếu không thể trích xuất dữ liệu
}

module.exports = { subscriber };
