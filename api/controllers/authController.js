const { json } = require("express");
const { admin } = require("../connectFirebase/connect");
const db = admin.firestore();
const crypto = require("crypto");
exports.register = async (req, res) => {
  const { email, password, faceId, fistName,lastName, isAdmin,isRole } = req.body;
  try {
    const user = await admin.auth().createUser({
      email,
      password,
    });

    await db.collection("users").doc(user.uid).set({
      email,
      faceId,
      fistName,
      lastName,
      isRole
    });

    const claims = { lastName };
    if (isAdmin === 1) {
      claims.role = "admin";
    } else if (isAdmin === 0) {
      claims.role = "user";
    }

    await admin.auth().setCustomUserClaims(user.uid, claims);

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
};
exports.login = async (req, res) => {
  const idToken = req.body.idToken;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    const userName = userData.lastName;
    console.log(userName);
    res.status(200).json({ name: userName });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
