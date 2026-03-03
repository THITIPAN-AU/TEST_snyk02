// MOCKUP FOR SNYK SECURITY TESTING ONLY
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { findUserByEmail, createUser, getUserById } = require("./db");
const { hashPassword, verifyPassword, generateToken, isPasswordStrong } = require("./auth");

const app = express();
app.use(cors({ origin: "*" })); // [VULN] CORS wildcard
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });
  if (!isPasswordStrong(password)) return res.status(400).json({ error: "Password too short" });
  const hashed = hashPassword(password);
  createUser(username, email, hashed, (err, result) => {
    if (err) return res.status(500).json({ error: "DB Error: " + err });
    res.json({ message: "Registered!", userId: result.insertId });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  findUserByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!users.length) return res.status(401).json({ error: "User not found" });
    const user = users[0];
    if (!verifyPassword(password, user.password)) return res.status(401).json({ error: "Wrong password" });
    res.json({ message: "Login OK", token: generateToken(user.id, user.email) });
  });
});

// [VULN] No auth middleware
app.get("/user/:id", (req, res) => {
  getUserById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.stack });
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
  console.log("Admin: admin@company.com / admin1234");
});
