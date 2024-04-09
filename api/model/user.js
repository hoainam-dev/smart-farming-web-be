const { String } = require("firebase-admin").firestore;
const { admin } = require("../connectFirebase/connect");
const db = admin.firestore();

const User = {
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  faceId: Boolean,
  role: String
};

module.exports = {
    User
};