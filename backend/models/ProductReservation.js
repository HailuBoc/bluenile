import mongoose from "mongoose";

/* ============================
   Product Schema
============================ */
const productSchema = new mongoose.Schema(
  {
    propertyName: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4 },
    img: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

/* ============================
   Reservation Schema
============================ */
const reservationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },

    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },

    // Store uploaded file path or URL instead of the raw File object
    paymentEvidence: { type: String, default: "" },

    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);
