import mongoose from "mongoose";

const vipTourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    date: { type: String, required: true },
    highlights: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.VipPost ||
  mongoose.model("vip-post", vipTourSchema);
