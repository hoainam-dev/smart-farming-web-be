var admin = require("firebase-admin");
var serviceAccount = require("../../smartfarming.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garden-app-v1-default-rtdb.firebaseio.com"
});

module.exports = { admin };


