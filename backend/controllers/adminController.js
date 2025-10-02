import { Property } from "../models/propertyModel.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import Booking from "../models/AdminDashBooking.js";
import { transporter } from "../config/email.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Verify token route
export const verifyToken = (req, res) => {
  res.json({ message: "Token is valid" });
};
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ bookings });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting booking", error: err.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};
// ----------------------------
// Admin Settings
// ----------------------------
let adminSettings = {
  basePrice: 500,
  vipFee: 300,
  chapaKey: "",
  telebirrKey: "",
  cbeKey: "",
};

export const getSettings = async (req, res) => {
  try {
    res.json({ settings: adminSettings });
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Server error fetching settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    adminSettings = { ...adminSettings, ...updates };
    res.json({ message: "Settings updated", settings: adminSettings });
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: "Server error updating settings" });
  }
};
export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().lean();
    res.json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Server error fetching bookings" });
  }
};
export const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.json(properties);
  } catch (err) {
    console.error("Error fetching approved properties:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property" });
  }
};

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const statusFilter = req.query.status;
    const filter = statusFilter ? { status: statusFilter } : {};
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create property
export const createProperty = async (req, res) => {
  try {
    const {
      listingType,
      propertyName,
      serviceType,
      address,
      price,
      userEmail,
      facilities,
      description,
      bedrooms,
      bathrooms,
      carModel,
      year,
      mileage,
      fuelType,
      landSize,
      rentTerm,
      rating, // ✅ from frontend
      autoApprove,
    } = req.body;

    const facilitiesArr = facilities ? JSON.parse(facilities) : [];
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const property = new Property({
      listingType,
      propertyName,
      serviceType,
      address,
      price,
      userEmail,
      facilities: facilitiesArr,
      description,
      bedrooms,
      bathrooms,
      carModel,
      year,
      mileage,
      fuelType,
      landSize,
      rentTerm,
      rating: rating ? Number(rating) : 0, // ✅ persist rating
      imageUrl,
      status: autoApprove === "true" ? "approved" : "pending",
    });

    await property.save();

    res.status(201).json({
      message:
        autoApprove === "true"
          ? "Property submitted and approved successfully"
          : "Property submitted successfully and is pending approval",
      property,
    });
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Update property status (approve/reject)
export const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status value" });

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // ✅ Only change status, rating remains unchanged (like propertyName)
    property.status = status;
    await property.save();

    res.json({ message: `Property has been ${status} successfully`, property });
  } catch (err) {
    console.error("Error updating property status:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update property (edit)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    const {
      listingType,
      propertyName,
      serviceType,
      address,
      price,
      userEmail,
      facilities,
      description,
      bedrooms,
      bathrooms,
      carModel,
      year,
      mileage,
      fuelType,
      landSize,
      rentTerm,
      rating, // ✅ rating update allowed
    } = req.body;

    if (listingType) property.listingType = listingType;
    if (propertyName) property.propertyName = propertyName;
    if (serviceType) property.serviceType = serviceType;
    if (address) property.address = address;
    if (price) property.price = price;
    if (userEmail) property.userEmail = userEmail;
    if (facilities) property.facilities = JSON.parse(facilities);
    if (description) property.description = description;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (carModel) property.carModel = carModel;
    if (year) property.year = year;
    if (mileage) property.mileage = mileage;
    if (fuelType) property.fuelType = fuelType;
    if (landSize) property.landSize = landSize;
    if (rentTerm) property.rentTerm = rentTerm;
    if (rating !== undefined) property.rating = Number(rating); // ✅ persist like propertyName

    if (req.file) {
      property.imageUrl = `/uploads/${req.file.filename}`;
    }

    await property.save();

    res.json({ message: "Property updated successfully", property });
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ error: "Server error" });
  }
};
