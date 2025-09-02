import mongoose from "mongoose";

const carReservationSchema = new mongoose.Schema(
  {
    carId: { type: Number, required: true },
    carTitle: { type: String, required: true },
    carPrice: { type: String, required: true }, // added carPrice
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CarReservation ||
  mongoose.model("CarSale", carReservationSchema);
