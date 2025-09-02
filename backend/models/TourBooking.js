import mongoose from "mongoose";

const tourBookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    tourDate: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true },
    vipService: { type: Boolean, default: false },
    message: { type: String },
    paymentMethod: {
      type: String,
      enum: ["Chapa", "Telebirr", "CBE Birr"],
      required: true,
    },
    document: { type: String }, // uploaded document for verification
    totalAmount: { type: Number, required: true },
    verified: { type: Boolean, default: false }, // manual verification for Telebirr/CBE
    paymentStatus: { type: String, default: "Pending" }, // Chapa / verification
  },
  { timestamps: true }
);

const TourBooking = mongoose.model("TourBooking", tourBookingSchema);
export default TourBooking;
