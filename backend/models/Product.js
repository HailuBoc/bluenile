import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true }, // e.g. "iPhone 15"
    address: { type: String },
    price: { type: Number },
    imageUrl: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    guestFavorite: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
