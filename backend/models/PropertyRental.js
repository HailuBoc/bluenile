import mongoose from "mongoose";

const PropertyRentalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    img: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // new properties start as pending
    },
  },
  { timestamps: true }
);

export default mongoose.models.PropertyRental ||
  mongoose.model("PropertyRental", PropertyRentalSchema);
