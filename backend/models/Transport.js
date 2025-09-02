import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // added phone
    date: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequests: { type: String },
    selectedServices: [String],
    paymentMethod: { type: String, required: true },
    car: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" }, // added paymentStatus
  },
  { timestamps: true }
);

export default mongoose.model("Transport", transportSchema);
