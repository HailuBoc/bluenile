import axios from "axios";
import GraduationBooking from "../models/GraduationBooking.js";

export const payWithChapa = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) return res.status(400).json({ error: "Missing bookingId" });

    const booking = await GraduationBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: booking.amount < 100 ? 100 : booking.amount,
        currency: "ETB",
        email: booking.email,
        first_name: booking.name,
        tx_ref: booking.tx_ref,
        callback_url: "http://localhost:3000/graduation-success",
        customization: {
          title: booking.name.substring(0, 16),
          description: "Graduation Booking Payment",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      checkout_url: chapaRes.data.data.checkout_url,
      booking,
    });
  } catch (err) {
    console.error("Chapa payment error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Chapa payment initialization failed",
      message: err.response?.data,
    });
  }
};
