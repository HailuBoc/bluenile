import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "host"], // ✅ now includes host
      default: "user", // ✅ all signups are "user" by default
    },
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

export const User = mongoose.model("User", userSchema);
