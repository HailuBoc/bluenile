import mongoose from "mongoose";

const generalEventBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true }, // NEW
    email: { type: String, required: true },
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    services: [{ type: String }],
    specialRequests: { type: String },
    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String }, // store file path or URL
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" }, // pending, paid, failed
  },
  { timestamps: true }
);

const GeneralEventBooking =
  mongoose.models.GeneralEventBooking ||
  mongoose.model("GeneralEventBooking", generalEventBookingSchema);

export default GeneralEventBooking;
