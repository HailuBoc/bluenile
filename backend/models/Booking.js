import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true },
    propertyTitle: { type: String, required: true },
    propertyType: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    specialRequests: { type: String },
    paymentMethod: { type: String, required: true },
    paymentEvidence: { type: String }, // path to uploaded file
    amount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
