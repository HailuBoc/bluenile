import mongoose from "mongoose";

const weddingBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // ✅ Added phone
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    marriageType: { type: String, required: true },
    selectedServices: [{ type: String }],
    specialRequests: { type: String },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Chapa", "Telebirr", "CBE Bank"],
      required: true,
    },
    paymentEvidence: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const WeddingBooking = mongoose.model("WeddingBooking", weddingBookingSchema);
export default WeddingBooking;
