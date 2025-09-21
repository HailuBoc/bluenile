import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    listingType: { type: String, required: true },
    serviceType: { type: String },
    propertyName: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    userEmail: { type: String, required: true },
    facilities: { type: [String], default: [] },
    description: { type: String },
    imageUrl: { type: String },

    // ✅ New rating field
    rating: { type: Number, default: 0, min: 0, max: 5 },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },
    verificationToken: { type: String },
  },
  { timestamps: true }
);

export const Property = mongoose.model("listProperty", propertySchema);
