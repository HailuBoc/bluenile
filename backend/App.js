// =========================== app.js ===========================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { UserModel } from "./model/userModel.js";
import { RegisterModel } from "./model/registerModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REGISTER FOR TUTORING ROUTE
app.post("/register", async (req, res) => {
  const { fullName, subjectNames, daysAvailable, timeSlot, phoneNumber, mode } =
    req.body;
  try {
    const newRegistration = await RegisterModel.create({
      fullName,
      subjectNames,
      daysAvailable,
      timeSlot,
      phoneNumber,
      mode,
    });

    res.status(201).json({
      message: "Registration successful",
      tutor: newRegistration,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({
      message: "Successfully logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB connected. Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
