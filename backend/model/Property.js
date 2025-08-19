import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    listingType: { type: String, required: true }, // rent, sale, lease, etc.
    propertyName: { type: String, required: true }, // apartment, car, land...
    address: { type: String, required: true },
    price: { type: Number, required: true },
    rooms: { type: Number }, // for houses, apartments
    bathrooms: { type: Number },
    facilities: [{ type: String }],
    carModel: { type: String },
    year: { type: Number },
    mileage: { type: Number },
    fuelType: { type: String },
    landSize: { type: Number },
    rentTerm: { type: String }, // daily, weekly, monthly
  },
  { timestamps: true }
);

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);
