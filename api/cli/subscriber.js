const { client, connect } = require("./publisher");
const { admin } = require("../connectFirebase/connect");
const { Humi, Temp } = require("./topic");

// connect()
const devicesRef = admin.firestore().collection("devices");
const sersorRef = admin.firestore().collection("sensors").doc("DBStaac6RvBSnDqzBTpl");
async function subscriber() {
  const querySnapshot = await admin.firestore().collection("devices").get();
  let topics = [];

  querySnapshot.forEach((doc) => {
    topics.push(doc.data().topic);
  });
  client.subscribe(topics, () => {
    console.log(`Subscribe to topic ${topics}`);
  });
  client.subscribe(Humi, () => {
    console.log(`Subscribe to topic ${Humi}`);
  });
  client.subscribe(Temp, () => {
    console.log(`Subscribe to topic ${Temp}`);
  });
  client.on("message", async (receivedTopic, message) => {
    if (receivedTopic === Temp) {
      const messageString = message.toString();
      const data = parseTemperature(messageString);
      
      if (data) {
        const { temperature } = data;

        try {
            await sersorRef
            .update({ temperature: temperature })
            .then(() => {
              console.log("Update success");
            })
            .catch((err) => {
              console.error("Error updating", err);
            });
        } catch (error) {
          console.error("Lỗi khi tìm kiếm phòng trong firebase:", error);
        }
      } else {
        console.error("Dữ liệu không hợp lệ:", messageString);
      }
    }
  });
  client.on("message", async (receivedTopic, message) => {
    if (receivedTopic === Humi) {
      const messageString = message.toString();
      const data = parseHumidity(messageString);
      
      if (data) {
        const { humidity } = data;
        
        try {
            await sersorRef
            .update({ humidity: humidity })
            .then(() => {
              console.log("Update success");
            })
            .catch((err) => {
              console.error("Error updating", err);
            });
        } catch (error) {
          console.error("Lỗi khi tìm kiếm phòng trong firebase:", error);
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
    if (topic == "RGB") {
      const messageString = message.toString();
      const querySnapshot = await devicesRef.where("topic", "==", "RGB").get();
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      querySnapshot.forEach((doc) => {
        const deviceRef = devicesRef.doc(doc.id);

        // Xác định giá trị mới cho các trường Hex và status
        const newHex =
          messageString !== "ON" && messageString !== "OFF"
            ? `#${messageString}`
            : doc.data().Hex;
        const newStatus =
          messageString === "ON" || messageString === "OFF"
            ? messageString
            : doc.data().status;

        // Cập nhật tài liệu
        deviceRef
          .update({
            Hex: newHex,
            status: newStatus,
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

function parseTemperature(messageString) {
  const temperatureRegex = /(\d+\.\d+)/i;

  const temperatureMatch = messageString.match(temperatureRegex);

  if (temperatureMatch) {
    const temperature = parseFloat(temperatureMatch[1]);
    return { temperature };
  }

  return null;
}
function parseHumidity(messageString) {
  const humidityRegex = /(\d+)/i;
    
  const humidityMatch = messageString.match(humidityRegex);

  if (humidityMatch) {
    const humidity = parseInt(humidityMatch[1], 10);
    return { humidity };
  }

  return null;
}
module.exports = { subscriber };
