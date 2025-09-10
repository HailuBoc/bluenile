import mongoose from "mongoose";

const houseInterestSchema = new mongoose.Schema(
  {
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    houseTitle: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, required: true },
    offerPrice: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "installment", "bank-transfer"],
    },
    verificationFile: { type: String },
  },
  { timestamps: true }
);

export const HouseInterest = mongoose.model(
  "HouseInterest",
  houseInterestSchema
);
