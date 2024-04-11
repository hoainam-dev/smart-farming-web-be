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
  const uid = req.params.id;
  const { role, lastName, firstName } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, { role: role, lastName: lastName });
    const userRef = admin.firestore().collection('users').doc(uid);
    await userRef.update({ isRole: role, firstName: firstName, lastName: lastName});
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
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const docRef = admin.firestore().collection("users").doc(id);
    const user = await docRef.get();
    const deletedUserFaceId = user.data().faceId;
    await docRef.delete();
    await admin.auth().deleteUser(id);

    const usersRef = admin.firestore().collection("users");

    const snapshot = await usersRef.where('faceId', '>', deletedUserFaceId).get();
    
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      const user = doc.data();
      batch.update(usersRef.doc(doc.id), { faceId: user.faceId - 1 });
    });
    await batch.commit();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user", error });
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