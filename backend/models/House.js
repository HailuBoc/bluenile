import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    houseTitle: { type: String, required: true }, // e.g. "Luxury Villa"
    address: { type: String },
    price: { type: Number },
    imageUrl: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    guestFavorite: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const House = mongoose.models.House || mongoose.model("House", houseSchema);
export default House;
