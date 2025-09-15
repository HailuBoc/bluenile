import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "car", "house", "product", etc.
  name: { type: String, required: true }, // propertyName, houseTitle, etc.
  address: { type: String, default: "" },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  images: { type: [String], default: [] },
  likes: { type: Number, default: 0 },
  guestFavorite: { type: Boolean, default: false },
});

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);
export default Item;
