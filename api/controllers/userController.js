const { admin } = require("../connectFirebase/connect");
const userModel = require("../model/user");
exports.getAllUsers = async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) =>
      userRecord.toJSON()
    );
    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error listing users", error });
  }
};

exports.updateUserRole = async (req, res) => {
  const { uid, role, name } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, { role: role, name: name });
    res
      .status(200)
      .json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating user role", error });
  }
};

exports.getUsers = async (req, res) => {
  const querySnapshot = await admin.firestore().collection("users").get();
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({
        id: doc.id,
        ...doc.data(),
    });
  });
  res.status(200).json({
    users
  });
};

exports.getUserDetails = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("users").doc(id);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    return res.status(404).send("User not found");
  }
  const user = docSnapshot.data();
  res.status(200).json({
    user,
  });
};
exports.getUsers = async (req, res) => {
  const querySnapshot = await admin.firestore().collection("users").get();
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({
        id: doc.id,
        ...doc.data(),
    });
  });
  res.status(200).json({
    users
  });
};

exports.getUserDetails = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("users").doc(id);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    return res.status(404).send("User not found");
  }
  const user = docSnapshot.data();
  res.status(200).json({
    user,
  });
};