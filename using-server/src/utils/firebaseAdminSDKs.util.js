const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREABSE_STORAGE_BUCKET,
});

// const { getStorage } = require("firebase-admin/storage");
// const bucket = getStorage().bucket();
// module.exports = bucket;
