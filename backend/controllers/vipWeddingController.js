// vipWeddingController.js
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import WeddingBooking from "../models/Vipwedding.js";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:10000";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * Create a new wedding booking
 */
export const createWeddingBooking = async (req, res) => {
  try {
    const {
      marriageType,
      name,
      phone,
      email,
      date,
      guests,
      selectedServices,
      specialRequests,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !marriageType ||
      !name ||
      !phone ||
      !email ||
      !date ||
      !guests ||
      !selectedServices?.length ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields for booking" });
    }

    const booking = await WeddingBooking.create({
      marriageType,
      name,
      phone,
      email,
      date,
      guests,
      selectedServices,
      specialRequests,
      paymentMethod,
      totalAmount,
      status: "pending",
    });

    return res.status(201).json({ booking });
  } catch (err) {
    console.error("Wedding Booking Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Initialize Payment for a wedding booking
 */
export const createWeddingPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, bookingId, phone } = req.body;
    const { method } = req.params;

    if (!amount || !email || !fullName || !bookingId || !method) {
      return res
        .status(400)
        .json({ message: "Missing required payment fields" });
    }

    const tx_ref = uuidv4();
    let checkout_url = null;

    // Chapa Payment
    if (method === "chapa") {
      const [firstName, ...rest] = fullName.split(" ");
      const lastName = rest.join(" ") || "NA";

      const chapaData = {
        amount: String(amount),
        currency: currency || "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref,
        callback_url: `${SERVER_URL}/vip/weddings/pay/${method}/verify/${bookingId}`,
        return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
      };

      const chapaRes = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        chapaData,
        { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
      );

      checkout_url = chapaRes.data?.data?.checkout_url;
      if (!checkout_url)
        return res.status(500).json({ message: "Chapa initiation failed" });
    }

    // Telebirr (placeholder)
    else if (method === "telebirr") {
      checkout_url = "https://example.com/telebirr_checkout"; // placeholder
    }

    // M-Pesa (placeholder)
    else if (method === "mpesa") {
      checkout_url = "https://example.com/mpesa_checkout"; // placeholder
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Save tx_ref to booking for verification
    await WeddingBooking.findByIdAndUpdate(bookingId, { tx_ref });

    return res.json({ checkout_url });
  } catch (err) {
    console.error(
      "Wedding Payment Init Error:",
      err.response?.data || err.message
    );
    return res.status(500).json({ message: "Payment server error" });
  }
};

/**
 * Verify Payment
 */
export const verifyWeddingPayment = async (req, res) => {
  const { method, bookingId } = req.params;
  const { tx_ref } = req.query;

  if (!tx_ref)
    return res.redirect(`${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`);

  try {
    let success = false;

    if (method === "chapa") {
      const verifyRes = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
      );
      success = verifyRes.data?.data?.status === "success";
    } else if (method === "telebirr" || method === "mpesa") {
      success = true; // placeholder for other gateways
    }

    if (success) {
      await WeddingBooking.findByIdAndUpdate(bookingId, { status: "paid" });
      return res.redirect(
        `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`
      );
    } else {
      return res.redirect(
        `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`
      );
    }
  } catch (err) {
    console.error("Wedding Verify Error:", err.response?.data || err.message);
    return res.redirect(`${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`);
  }
};
