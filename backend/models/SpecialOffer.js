import mongoose from "mongoose";

const SpecialOfferSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    address: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    imageUrl: { type: String },
    isSpecialOffer: { type: Boolean, default: true }, // ✅ always true
    status: {
      type: String,
      enum: ["approved", "pending"],
      default: "approved",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("SpecialOffer", SpecialOfferSchema);
