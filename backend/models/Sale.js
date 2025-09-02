import mongoose from "mongoose";

const saleBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    car: { type: String, required: true }, // the property/vehicle title
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String }, // uploaded file path
    specialRequests: { type: String },
  },
  { timestamps: true }
);

const SaleBooking = mongoose.model("SaleBooking", saleBookingSchema);

export default SaleBooking;
