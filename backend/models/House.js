import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    description: { type: String, default: "" },
    imageUrl: { type: [String], default: [] },
    guestFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const House = mongoose.model("House", houseSchema);
