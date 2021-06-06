const admin = require("firebase-admin");

var serviceAccount = require("../key.json");

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//  = admin.firestore();

module.exports = db;