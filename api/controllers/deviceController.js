const { publishManuallyStatus, publishLCDStatus, publishRGB, publishtempFan, publishAutoStatus } = require("../cli/publisher");
const { MANUALLY } = require("../cli/topic");
const { admin } = require("../connectFirebase/connect");
const deviceModel = require("../model/device");

exports.getDevices = async (req, res) => {
  const querySnapshot = await admin.firestore().collection("devices").get();

  let devices = [];
  querySnapshot.forEach((doc) => {
    devices.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  req.app.io.emit('devices', devices);
  res.status(200).json({
    devices,
  });
};

exports.getDeviceDetails = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("devices").doc(id);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    return res.status(404).send("Device not found");
  }
  const device = docSnapshot.data();
  res.status(200).json({
    device,
  });
};
exports.getDeviceCollection = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("devices").doc(id);
  const docSnapshot = await docRef.get();

  if(!docSnapshot.exists){
    return res.status(404).send("Device not found");
  }
  const subCollectionSnapshot = await docRef.collection("mode").get();
  const data = await Promise.all(subCollectionSnapshot.docs.map(async doc => {
    const docData = await docRef.collection("mode").doc(doc.id).get();
    const dataCollection = {
      id: doc.id,
      ...docData.data(),
    }
    return dataCollection;
  }));
  
  res.status(200).json({
    data,
  });
};
// exports.updateDeviceCollection = async (req, res) => {
//   const deviceId = req.params.id;
//   const modeId = req.params.modeId;
//   const newData = req.body;

//   const docRef = admin.firestore().collection("devices").doc(deviceId);
//   const docSnapshot = await docRef.get();

//   if(!docSnapshot.exists){
//     return res.status(404).send("Device not found");
//   }

//   const modeDocRef = docRef.collection("mode").doc(modeId);
//   const modeDocSnapshot = await modeDocRef.get();

//   if(!modeDocSnapshot.exists){
//     return res.status(404).send("Mode not found");
//   }

//   await modeDocRef.update(newData);

//   res.status(200).send("Update successful");
// };
exports.updateDeviceCollection = async (req, res) => {
  const deviceId = req.body.deviceId;
  const { topic, status } = req.body;
  
  const docRef = admin.firestore().collection("devices").doc(deviceId);
  const docSnapshot = await docRef.get();

  if(!docSnapshot.exists){
    return res.status(404).send("Device not found");
  }

  const modeCollectionRef = docRef.collection("mode");
  const modeCollectionSnapshot = await modeCollectionRef.get();

  if(modeCollectionSnapshot.empty){
    return res.status(404).send("Mode collection is empty");
  }

  const updates = modeCollectionSnapshot.docs.map(doc => {
    return modeCollectionRef.doc(doc.id).update({
      status: status,
      topic: topic,
    });
  });

  await Promise.all(updates);
  publishAutoStatus(topic,deviceId,status);
  res.status(200).send("Update successful");
};
exports.updateManuallyStatus = async (req, res) => {
  const id = req.params.id;
  const { topic, status } = req.body;
  const docRef = admin.firestore().collection("devices").doc(id);
  await docRef.update({
    status: status,
  });
  publishManuallyStatus(topic, id, status);
  res.status(200).send("Device status updated successfully!");
};
exports.updateRGB = async (req, res) => {
  const id = req.params.id;
  const { topic, Hex } = req.body;
  const docRef = admin.firestore().collection("devices").doc(id);
  await docRef.update({
    Hex: Hex,
  });
  publishRGB(topic, id, Hex);
  res.status(200).send("Device status updated successfully!");
};
exports.updateTempFan = async (req, res) => {
  const id = req.params.id;
  const { topic, temp } = req.body;
  const docRef = admin.firestore().collection("devices").doc(id);
  await docRef.update({
    temp: temp,
  });
  publishtempFan(topic, id, temp);
  res.status(200).send("Device status updated successfully!");
}
exports.create = async (req, res) => {
  try {
    await deviceModel.createDevice(req.body);
    res.status(201).json({ message: "Tạo thành công!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await deviceModel.updateDevice(id, data);

  res.json({ message: "Cập nhật thành công!" });
};
exports.remove = async (req, res) => {
  const id = req.params.id;

  await deviceModel.deleteDevice(id);

  res.json({ message: "Xóa thành công!" });
};
