import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: String,
  model: String,
  likes: { type: Number, default: 0 },
  // other fields...
});

export default mongoose.model("Car", carSchema);
