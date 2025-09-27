import mongoose from "mongoose";

const salePostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Apartment", "House", "Land", "Vehicle"],
      required: true,
    },
    price: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String }, // will hold file path or URL
  },
  { timestamps: true }
);

export default mongoose.models.SalePost ||
  mongoose.model("SalePost", salePostSchema);
