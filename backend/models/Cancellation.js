import mongoose from "mongoose";

const CancellationSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      required: true,
      enum: [
        "Property Rental",
        "Event",
        "Transport Service",
        "Sales",
        "Tourism",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cancellation", CancellationSchema);
