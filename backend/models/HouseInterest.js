import mongoose from "mongoose";

const houseInterestSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true },
    listingTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    offerPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    verificationFile: { type: String }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("HouseInterest", houseInterestSchema);
