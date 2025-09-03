import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
});

export const User = mongoose.model("User", userSchema);
