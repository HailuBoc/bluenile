// models/BirthdayBooking.js
import mongoose from "mongoose";

const birthdayBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }, // optional
    birthdayDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    selectedServices: { type: Array, required: true },
    specialRequests: { type: String },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentEvidence: { type: String }, // uploaded file path
  },
  { timestamps: true }
);

const BirthdayBooking = mongoose.model(
  "BirthdayBooking",
  birthdayBookingSchema
);

export default BirthdayBooking;
