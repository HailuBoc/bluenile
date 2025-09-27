import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    icon: { type: String }, // store icon name like "Map", "Calendar", etc.
    destinations: [{ type: String }], // each item is a point under the category
  },
  { timestamps: true }
);

const RegularPost =
  mongoose.models.RegularPost || mongoose.model("regularpost", tourSchema);
export default RegularPost;
