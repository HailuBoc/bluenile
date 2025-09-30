// models/SpecialReservation.js
import mongoose from "mongoose";

const specialReservationSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    offerTitle: { type: String, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },

    amount: { type: Number, required: true },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String }, // filesystem path or URL
    status: { type: String, default: "pending" }, // pending, paid
  },
  { timestamps: true }
);

export default mongoose.models.SpecialReservation ||
  mongoose.model("SpecialReservations", specialReservationSchema);
