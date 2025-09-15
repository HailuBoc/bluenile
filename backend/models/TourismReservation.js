import mongoose from "mongoose";

const tourismReservationSchema = new mongoose.Schema(
  {
    tourismId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourism",
      required: true,
    },
    tourismTitle: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String }, // store file path
  },
  { timestamps: true }
);

export default mongoose.model("TourismReservation", tourismReservationSchema);
