import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    listingType: { type: String, required: true },
    propertyName: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    userEmail: { type: String, required: true }, // added for user notifications

    // Optional fields
    bedrooms: Number,
    bathrooms: Number,
    facilities: [{ type: String }],
    carModel: String,
    year: Number,
    mileage: Number,
    fuelType: String,
    landSize: Number,
    rentTerm: String,
  },
  { timestamps: true }
);

export const Property = mongoose.model("listProperty", propertySchema);
