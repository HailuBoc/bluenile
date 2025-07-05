// import express from "express";
// import mongoose from "mongoose";
// import { UserModel } from "./model/userModel.js";
// import cors from "cors";
// import dotenv from "dotenv";

import express from "express";
import mongoose from "mongoose";
import { UserModel } from "./model/userModel.js";
import cors from "cors";
import dotenv from "dotenv";

// Load correct .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// SIGNUP
app.post("/signup", (req, res) => {
  const { email } = req.body;

  UserModel.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.json({ message: "User Already Exists" });
    }

    UserModel.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json({ error: err.message }));
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.status(200).json("Successfully logged in");
      } else {
        res.status(401).json("Incorrect password");
      }
    } else {
      res.status(500).json("You haven't been registered");
    }
  });
});
app.get("/", (req, res) => {
  res.send("welcome to the backend server");
});
// GET USERS
app.get("/signup", async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// CONNECT TO MONGO
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB Connected. Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed:", error);
  });
