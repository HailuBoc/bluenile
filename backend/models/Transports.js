import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    vehicleName: { type: String, required: true },
    vehicleType: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Transportpost =
  mongoose.models.Transportpost ||
  mongoose.model("Transportpost", transportSchema);
export default Transportpost;
