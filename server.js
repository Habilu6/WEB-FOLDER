const express = require("express");
const cors = require("cors");
const path = require("path");
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); // Hakikisha jina linalingana na file yako

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://money-dashboard-20fe9-default-rtdb.firebaseio.com", // Badilisha na project yako ya Firebase
});

console.log("Firebase connected successfully!");

const app = express();
app.use(cors());
app.use(express.json());
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await admin.auth().createUser({
        email,
        password,
      });
      res.json({ message: "User created successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      res.json({ message: "Login successful", user: userRecord });
    } catch (error) {
      res.status(400).json({ error: "Invalid email or password" });
    }
  });

// Ruhusu mafaili yote ndani ya folda ya WEB FOLDER
app.use(express.static(__dirname));

// Route ya kupeleka user kwenye login.html (hakikisha login.html iko ndani ya folda yako ya WEB FOLDER)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Server inasikiliza kwenye port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});