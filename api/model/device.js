const { String, Timestamp } = require("firebase-admin").firestore;
const { admin } = require("../connectFirebase/connect");
const db = admin.firestore();

const Device = {
  name: String,
  status: String,
  topic: String,
  turn_off: {
    type: Timestamp,
    default: null,
  },
  turn_on: {
    type: Timestamp,
    default: null,
  },
};

async function createDevice(data) {
  data.turn_on = admin.firestore.FieldValue.serverTimestamp();

  const ref = await db.collection("devices").add(data);

  return ref;
}

async function updateDevice(id, data) {
  return db.collection("devices").doc(id).update(data);
}

async function deleteDevice(id) {
  return db.collection("devices").doc(id).delete();
}

module.exports = {
  Device,
  createDevice,
  updateDevice,
  deleteDevice,
};
