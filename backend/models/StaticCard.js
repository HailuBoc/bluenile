import mongoose from "mongoose";

const staticCardSchema = new mongoose.Schema(
  {
    // Card type: 'product', 'house', 'car', 'carsale', 'tourism', 'specialoffer'
    cardType: {
      type: String,
      required: true,
      enum: ["product", "house", "car", "carsale", "tourism", "specialoffer"],
    },
    // Basic info
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    // Images
    imageUrl: {
      type: [String],
      default: [],
    },
    // Location info
    location: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    // Rating
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // For houses/cars
    bedrooms: {
      type: Number,
      default: null,
    },
    bathrooms: {
      type: Number,
      default: null,
    },
    guests: {
      type: Number,
      default: null,
    },
    // For cars
    carName: {
      type: String,
      default: "",
    },
    make: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      default: null,
    },
    mileage: {
      type: Number,
      default: null,
    },
    transmission: {
      type: String,
      default: "",
    },
    fuelType: {
      type: String,
      default: "",
    },
    // For tourism
    duration: {
      type: String,
      default: "",
    },
    groupSize: {
      type: Number,
      default: null,
    },
    // For special offers
    discount: {
      type: Number,
      default: 0,
    },
    offerPrice: {
      type: Number,
      default: null,
    },
    // Admin control
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    // Optional link to dynamic property
    linkedPropertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    // Additional metadata
    tags: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    // For display order
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
staticCardSchema.index({ cardType: 1, isActive: 1, isApproved: 1 });
staticCardSchema.index({ cardType: 1, displayOrder: 1 });
staticCardSchema.index({ isActive: 1, isApproved: 1, priority: -1 });

export const StaticCard = mongoose.model("StaticCard", staticCardSchema);
