import mongoose from "mongoose";

const graduationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true }, // NEW
    email: { type: String, required: true },
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    selectedServices: [{ type: String }],
    specialRequests: { type: String },
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentEvidence: { type: String }, // store filename or URL if needed
    status: { type: String, default: "pending" }, // pending, paid, failed
  },
  { timestamps: true }
);

export default mongoose.models.Graduation ||
  mongoose.model("Graduation", graduationSchema);
