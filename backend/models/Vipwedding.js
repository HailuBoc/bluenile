import mongoose from "mongoose";

const WeddingBookingSchema = new mongoose.Schema(
  {
    marriageType: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    selectedServices: { type: [String], required: true },
    specialRequests: { type: String },
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.vipwedding ||
  mongoose.model("vipwedding", WeddingBookingSchema);
