import TourBooking from "../models/TourBooking.js";
import path from "path";

// Get all pending bookings (Telebirr / CBE Birr)
export const getPendingBookings = async (req, res) => {
  try {
    const bookings = await TourBooking.find({
      paymentMethod: { $in: ["Telebirr", "CBE Birr"] },
      verified: false,
    }).sort({ createdAt: -1 });

    res.json({ status: "success", bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching pending bookings" });
  }
};

// Verify a booking
export const verifyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body; // true or false

    const booking = await TourBooking.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.verified = verified;
    booking.paymentStatus = verified ? "Paid" : "Rejected";
    await booking.save();

    res.json({ status: "success", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error verifying booking" });
  }
};
