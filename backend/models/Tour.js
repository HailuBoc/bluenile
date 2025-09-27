import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["regular", "vip"], required: true },
    category: { type: String }, // for regular tours
    name: { type: String }, // for VIP tours
    description: { type: String },
    date: { type: String },
    destinations: { type: [String], default: [] }, // for regular tours
    highlights: { type: [String], default: [] }, // for VIP tours
    icon: { type: String }, // optional: icon name for regular tours
    image: { type: String }, // VIP image path
  },
  { timestamps: true }
);

export default mongoose.models.Tour || mongoose.model("Tour", tourSchema);
