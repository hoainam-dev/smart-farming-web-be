const { publishManuallyStatus, publishLCDStatus, publishRGB, publishtempFan, publishAutoStatus } = require("../cli/publisher");
const { admin } = require("../connectFirebase/connect");
const deviceModel = require("../model/employee");

exports.getAttendances = async (req, res) => {
  const querySnapshot = await admin.firestore().collection("attendance").get();
  let attendances = [];
  querySnapshot.forEach((doc) => {
    attendances.push({
      id: doc.id,
    });
  });
  res.status(200).json({
    attendances
  });
};

exports.getAttendanceDetails = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("attendance").doc(id);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    return res.status(404).send("Attendance not found");
  }
  const attendance = docSnapshot.data();
  res.status(200).json({
    attendance,
  });
};
exports.getAttendanceCollection = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("attendance").doc(id);
  const docSnapshot = await docRef.get();

  // if(!docSnapshot.exists){
  //   return res.status(404).send("Attendance not found");
  // }
  const subCollectionSnapshot = await docRef.collection("data").get();
  const data = await Promise.all(subCollectionSnapshot.docs.map(async doc => {
    console.log("doc.id " + doc.id);
    const docData = await docRef.collection("data").doc(doc.id).get();
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