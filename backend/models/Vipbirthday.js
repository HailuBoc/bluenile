import mongoose from "mongoose";

const birthdaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    guests: { type: Number, required: true },
    selectedServices: [{ type: String, required: true }],
    specialRequests: { type: String },
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("vipBirthday", birthdaySchema);
