import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import GraduationBooking from "../models/Vipgraduation.js";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:10000";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * Create Graduation Booking & Initialize Payment
 */
export const createGraduationBooking = async (req, res) => {
  try {
    const {
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
      !name ||
      !phone ||
      !email ||
      !date ||
      !guests ||
      !selectedServices?.length ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save booking first
    const booking = await GraduationBooking.create({
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
    console.error("Graduation Booking Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Initialize Payment (Chapa, Telebirr, M-Pesa)
 */
export const createPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, bookingId, phone } = req.body;
    const { method } = req.params;

    if (!amount || !email || !fullName || !bookingId || !method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tx_ref = uuidv4();
    let checkout_url = null;

    // Chapa
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
        callback_url: `${SERVER_URL}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
      };
      const chapaRes = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        chapaData,
        {
          headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
        }
      );
      checkout_url = chapaRes.data?.data?.checkout_url;
      if (!checkout_url)
        return res.status(500).json({ message: "Chapa initiation failed" });
    }

    // Telebirr (placeholder)
    else if (method === "telebirr") {
      const teleRes = await axios.post(
        process.env.TELEBIRR_INIT_URL || "https://api.telebirr.com/init",
        {
          amount,
          msisdn: phone,
          tx_ref,
          callback_url: `${SERVER_URL}/bookings/pay/${method}/verify/${bookingId}`,
          return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TELEBIRR_SECRET_KEY}`,
          },
        }
      );
      checkout_url = teleRes.data?.checkout_url;
      if (!checkout_url)
        return res.status(500).json({ message: "Telebirr initiation failed" });
    }

    // M-Pesa (placeholder)
    else if (method === "mpesa") {
      const mpesaRes = await axios.post(
        process.env.MPESA_INIT_URL || "https://api.safaricom.co.ke/mpesa/init",
        {
          amount,
          phone,
          tx_ref,
          callback_url: `${SERVER_URL}/bookings/pay/${method}/verify/${bookingId}`,
          return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
        },
        { headers: { Authorization: `Bearer ${process.env.MPESA_SECRET_KEY}` } }
      );
      checkout_url = mpesaRes.data?.checkout_url;
      if (!checkout_url)
        return res.status(500).json({ message: "M-Pesa initiation failed" });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Save tx_ref to booking
    await GraduationBooking.findByIdAndUpdate(bookingId, { tx_ref });

    return res.json({ checkout_url });
  } catch (err) {
    console.error("Payment Init Error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Payment server error" });
  }
};

/**
 * Verify Payment
 */
export const verifyPayment = async (req, res) => {
  const { method, bookingId } = req.params;
  const { tx_ref } = req.query;

  if (!tx_ref)
    return res.redirect(`${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`);

  try {
    let success = false;

    if (method === "chapa") {
      const verifyRes = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        {
          headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
        }
      );
      success = verifyRes.data?.data?.status === "success";
    } else if (method === "telebirr") {
      success = true; // placeholder
    } else if (method === "mpesa") {
      success = true; // placeholder
    }

    if (success) {
      await GraduationBooking.findByIdAndUpdate(bookingId, { status: "paid" });
      return res.redirect(
        `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`
      );
    } else {
      return res.redirect(
        `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`
      );
    }
  } catch (err) {
    console.error("Payment Verify Error:", err.response?.data || err.message);
    return res.redirect(`${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`);
  }
};
