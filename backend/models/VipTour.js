import mongoose from "mongoose";

const vipTourSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true }, // maps from fullName
    date: { type: Date, required: true }, // maps from tourDate
    extras: { type: [String], default: [] }, // maps from vipService
    notes: { type: String }, // maps from message
    phone: { type: String, required: true },
    email: { type: String, required: true },
    numberOfPeople: { type: Number, default: 1 }, // new field from frontend
    paymentMethod: { type: String, required: true },
    paymentProof: { type: String }, // uploaded file path
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const VipTour = mongoose.model("vipTour", vipTourSchema);

export default VipTour;
