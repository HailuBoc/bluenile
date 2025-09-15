// models/WeddingBooking.js
import mongoose from "mongoose";

const WeddingBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    marriageType: { type: String, required: true },
    selectedServices: { type: [String], default: [] },
    specialRequests: { type: String, default: "" },
    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String, default: "" },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("WeddingBooking", WeddingBookingSchema);
