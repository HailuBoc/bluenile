import mongoose from "mongoose";

const vipTourSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    extras: { type: [String], default: [] },
    notes: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    numberOfPeople: { type: Number, default: 1 },
    paymentMethod: { type: String, required: true },
    paymentProof: { type: String }, // now just a URL or text
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
