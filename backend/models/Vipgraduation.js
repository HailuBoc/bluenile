import mongoose from "mongoose";

const GraduationBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    selectedServices: { type: [String], required: true },
    totalAmount: { type: Number, required: true },
    specialRequests: { type: String },
    paymentMethod: { type: String },
    tx_ref: { type: String }, // for tracking payment
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("vipgraduation", GraduationBookingSchema);
