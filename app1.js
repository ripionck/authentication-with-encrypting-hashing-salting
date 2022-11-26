//match from database authentication

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/user.model");

const PORT = process.env.PORT || 4001;
const dbURL = process.env.DB_URL;
const app = express();

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", async (req, res) => {
  //const { email, password } = req.body;
  //res.send({ email, password });
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user && user.password === password) {
      res.status(201).json({ status: "Valid user" });
    } else {
      res.status(400).json({ status: "User not found" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use((req, res, next) => {
  res.status(400).send("Router not found");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
