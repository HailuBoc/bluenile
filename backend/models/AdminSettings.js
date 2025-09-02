import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    basePrice: { type: Number, required: true },
    vipFee: { type: Number, required: true },
    chapaKey: { type: String, required: true },
    telebirrKey: { type: String, required: true },
    cbeKey: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AdminSettings", adminSettingsSchema);
