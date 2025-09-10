import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    listingType: { type: String, required: true }, // house, car, land, etc.
    propertyName: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    userEmail: { type: String }, // optional if admin creates
    facilities: [{ type: String }],
    description: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    carModel: { type: String },
    year: { type: Number },
    mileage: { type: Number },
    fuelType: { type: String },
    landSize: { type: String },
    rentTerm: { type: String },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", propertySchema);
