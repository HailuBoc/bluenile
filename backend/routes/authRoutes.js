// routes/authRoutes.js
import express from "express";
import {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getUserById,
  getUserByEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Forgot / Reset password
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/:id", getUserById);
router.get("/user/:email", getUserByEmail);

export default router;
