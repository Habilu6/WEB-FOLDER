const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); // Hakikisha jina linafanana

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://money-dashboard-20fe9-default-rtdb.firebaseio.com" // Badilisha na database yako
});

module.exports = admin;