const { String, Timestamp } = require("firebase-admin").firestore;
const { admin } = require("../connectFirebase/connect");
const db = admin.firestore();

const devices = {
  name: String,
  statis: String,
  location: String,
  plantingDate: Timestamp,
  description: String,
};
async function createPlant(data) {
  data.plantingDate = admin.firestore.FieldValue.serverTimestamp();
  const ref = await db.collection("plants").add(data);
  return ref;
}
async function createCollection(
  parentId,
  newCollectionName,
  proposal,
  dateChek,
  Diagnostic
) {
  try {
    const parentDocumentRef = db.collection("plants").doc(parentId);
    const newCollectionRef = parentDocumentRef.collection(newCollectionName);
    const data = {
      proposal: proposal,
      dateChek: admin.firestore.FieldValue.serverTimestamp(),
      Diagnostic: Diagnostic,
    };
    const docRef = await newCollectionRef.add(data);

    console.log(`Document added with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}
async function updatePlants(id, data) {
  data.plantingDate = admin.firestore.FieldValue.serverTimestamp();
  return db.collection("plants").doc(id).update(data);
}
async function deletePlant(id) {
  return db.collection("plants").doc(id).delete();
}
module.exports = { devices, createPlant, createCollection, updatePlants,deletePlant };
