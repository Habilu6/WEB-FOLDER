const express = require("express");
const cors = require("cors");
const path = require("path");
const admin = require("firebase-admin");

// Hakikisha service-account.json iko kwenye root ya project
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://money-dashboard-20fe9-default-rtdb.firebaseio.com", // Badilisha na Firebase yako
});

console.log("Firebase connected successfully!");

const app = express();
app.use(cors());
app.use(express.json());

// Ruhusu mafaili yote kwenye WEB FOLDER
app.use(express.static(__dirname));

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint (Haisaidii kuthibitisha password hapa, inapaswa kufanywa kwenye frontend)
app.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    res.json({ message: "Login successful", user: userRecord });
  } catch (error) {
    res.status(400).json({ error: "Invalid email" });
  }
});

// Route ya kupeleka user kwenye login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Server inasikiliza kwenye port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});