import mongoose from "mongoose";

const specialOfferSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    address: String,
    price: Number,
    imageUrl: String,
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }, // ✅ add likes field
  },
  { timestamps: true }
);

export default mongoose.model("SpecialOfferlike", specialOfferSchema);
