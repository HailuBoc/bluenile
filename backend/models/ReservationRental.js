import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true },
    listingTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    nights: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      required: true,
    },
    paymentEvidence: { type: String },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ReservationRental", reservationSchema);
