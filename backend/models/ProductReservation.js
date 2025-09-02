import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // listing info
    listingId: { type: Number, required: true },
    listingTitle: { type: String, required: true },

    // guest info (flattened like your Sale model)
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    // stay info
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },

    // payment
    amount: { type: Number, required: true }, // total price (ETB)
    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String }, // uploaded file path (Telebirr/CBE/M-Pesa)

    // optional: simple status (pending until file verified or chapa succeeds)
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("productReservation", reservationSchema);
export default Reservation;
