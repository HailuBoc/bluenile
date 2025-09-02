import mongoose from "mongoose";

const quoteRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true }, // Wedding, Birthday, Graduation, General
    eventDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    selectedServices: [{ type: String }], // store selected services
    totalPrice: { type: Number, required: true }, // store total price
    message: { type: String },
  },
  { timestamps: true }
);

const QuoteRequest =
  mongoose.models.QuoteRequest ||
  mongoose.model("QuoteRequest", quoteRequestSchema);

export default QuoteRequest;
