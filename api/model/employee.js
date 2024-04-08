const { String } = require("firebase-admin").firestore;
const { admin } = require("../connectFirebase/connect");
const db = admin.firestore();

const Employee = {
  id: String,
  name: String,
  date: String,
  time: String
};

module.exports = {
    Employee
};
