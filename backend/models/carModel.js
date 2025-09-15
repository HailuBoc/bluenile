import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  price: { type: Number },
  imageUrl: [String],
  likes: { type: Number, default: 0 }, // ✅ This is the key
  guestFavorite: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
});

export default mongoose.model("Car", carSchema);
