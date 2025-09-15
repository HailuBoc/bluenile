import Booking from "../models/Booking.js";
import path from "path";
import fs from "fs";

// Create booking
import Booking from "../models/Booking.js";

// Create booking with Multer handling file uploads
import Booking from "../models/Booking.js";
import path from "path";
import fs from "fs";

// Create Booking
export const createBooking = async (req, res) => {
  try {
    // Extract data from req.body
    const {
      propertyId,
      propertyTitle,
      propertyType,
      fullName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      paymentMethod,
      amount,
      paymentStatus,
    } = req.body;

    if (
      !propertyId ||
      !propertyTitle ||
      !propertyType ||
      !fullName ||
      !email ||
      !phone ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests ||
      !paymentMethod ||
      !amount ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle payment evidence if uploaded
    let paymentEvidence = "";
    if (req.file) {
      paymentEvidence = req.file.path; // store path to uploaded file
    }

    const booking = await Booking.create({
      propertyId,
      propertyTitle,
      propertyType,
      fullName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests: specialRequests || "",
      paymentMethod,
      paymentEvidence,
      amount,
      paymentStatus,
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
