import mongoose from "mongoose";

const specialOfferReservationSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpecialOffer",
      required: true,
    },
    offerTitle: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, default: 1 },
    amount: { type: Number, required: true },

    // Guest info
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["chapa", "telebirr", "cbe-birr", "mpesa"],
      default: "chapa",
    },
    paymentEvidence: { type: String }, // store file path if uploaded
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "SpecialOfferReservation",
  specialOfferReservationSchema
);
