import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import GeneralEventBooking from "../models/Vipgeneralevent.js";

dotenv.config();

// Create General Event Booking
export const createGeneralEventBooking = async (req, res) => {
  try {
    const formData = req.body;

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.date ||
      !formData.guests ||
      !formData.selectedServices.length ||
      !formData.paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await GeneralEventBooking.create({
      ...formData,
      selectedServices: Array.isArray(formData.selectedServices)
        ? formData.selectedServices
        : JSON.parse(formData.selectedServices),
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(500).json({ error: "Server error creating booking" });
  }
};

// Payment initialization (Chapa, Telebirr, Mpesa)
export const createPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, bookingId, phone } = req.body;
    const { method } = req.params;

    if (!amount || !email || !fullName || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "NA";
    const tx_ref = uuidv4();

    const callbackBase = process.env.SERVER_URL || "http://localhost:5000";
    const returnBase = process.env.CLIENT_URL || "http://localhost:3000";
    let checkout_url = null;

    // 🟢 Chapa
    if (method === "chapa") {
      const data = {
        amount: String(amount),
        currency: currency || "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref,
        callback_url: `${callbackBase}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${returnBase}/bookings/success?bookingId=${bookingId}`,
      };

      const chapaRes = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (chapaRes.data?.status === "success")
        checkout_url = chapaRes.data.data.checkout_url;
      else
        return res
          .status(500)
          .json({ message: "Chapa payment initiation failed" });
    }

    // 🟡 Telebirr
    else if (method === "telebirr") {
      const payload = {
        amount,
        msisdn: phone || "",
        tx_ref,
        callback_url: `${callbackBase}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${returnBase}/bookings/success?bookingId=${bookingId}`,
      };

      const teleRes = await axios.post(process.env.TELEBIRR_INIT_URL, payload, {
        headers: {
          Authorization: `Bearer ${process.env.TELEBIRR_SECRET_KEY || ""}`,
          "Content-Type": "application/json",
        },
      });

      if (teleRes.data?.checkout_url) checkout_url = teleRes.data.checkout_url;
      else
        return res
          .status(500)
          .json({ message: "Telebirr payment initiation failed" });
    }

    // 🔵 M-Pesa
    else if (method === "mpesa") {
      const payload = {
        amount,
        phone: phone || "",
        tx_ref,
        callback_url: `${callbackBase}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${returnBase}/bookings/success?bookingId=${bookingId}`,
      };

      const mpesaRes = await axios.post(process.env.MPESA_INIT_URL, payload, {
        headers: {
          Authorization: `Bearer ${process.env.MPESA_SECRET_KEY || ""}`,
          "Content-Type": "application/json",
        },
      });

      if (mpesaRes.data?.checkout_url)
        checkout_url = mpesaRes.data.checkout_url;
      else
        return res
          .status(500)
          .json({ message: "M-Pesa payment initiation failed" });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Save tx_ref
    await GeneralEventBooking.findByIdAndUpdate(bookingId, { tx_ref });
    res.json({ checkout_url });
  } catch (error) {
    console.error("Payment Init Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment server error" });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  const { method, bookingId } = req.params;
  const { tx_ref } = req.query;

  const clientSuccess = `${
    process.env.CLIENT_URL || "http://localhost:3000"
  }/bookings/success?bookingId=${bookingId}`;
  const clientFail = `${
    process.env.CLIENT_URL || "http://localhost:3000"
  }/bookings/failed?bookingId=${bookingId}`;

  try {
    let success = false;

    if (method === "chapa") {
      const verifyRes = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
      );
      success = verifyRes.data?.data?.status === "success";
    } else if (method === "telebirr" || method === "mpesa") {
      // Placeholder: assume success
      success = true;
    }

    if (success)
      await GeneralEventBooking.findByIdAndUpdate(bookingId, {
        status: "paid",
      });
    res.redirect(success ? clientSuccess : clientFail);
  } catch (err) {
    console.error("Payment Verify Error:", err.response?.data || err.message);
    res.redirect(clientFail);
  }
};
