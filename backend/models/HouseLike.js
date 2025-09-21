import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: [{ type: String }],
    price: { type: Number },
    rating: { type: Number, default: 0 },
    guestFavorite: { type: Boolean, default: false },

    // ✅ simple likes system
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.House ||
  mongoose.model("Houselike", houseSchema);
