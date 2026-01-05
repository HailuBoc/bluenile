import mongoose from "mongoose";

const saleBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    car: { type: String, required: true }, // still represents item title
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    specialRequests: { type: String },
    status: { type: String, default: "pending" }, // pending, paid
  },
  { timestamps: true }
);

export default mongoose.models.SaleBooking ||
  mongoose.model("SaleBooking", saleBookingSchema);
