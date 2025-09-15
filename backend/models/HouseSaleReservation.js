// models/HouseSaleReservation.js
import mongoose from "mongoose";

const HouseSaleReservationSchema = new mongoose.Schema(
  {
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    houseName: {
      type: String,
      required: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    appointmentDate: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank-transfer"],
      default: "cash",
      required: true,
    },
    paymentEvidence: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HouseSaleReservation ||
  mongoose.model("HouseSaleReservation", HouseSaleReservationSchema);
