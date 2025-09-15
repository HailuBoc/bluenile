import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Initialize Chapa Payment
export const createChapaPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, bookingId } = req.body;

    if (!amount || !email || !fullName || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "NA";

    const data = {
      amount: String(amount),
      currency: currency || "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: uuidv4(),
      callback_url: `http://localhost:10000/bookings/pay/chapa/verify/${bookingId}`,
      return_url: `http://localhost:3000/bookings/success?bookingId=${bookingId}`,
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

    if (chapaRes.data?.status === "success") {
      return res.json({ checkout_url: chapaRes.data.data.checkout_url });
    } else {
      return res
        .status(500)
        .json({ message: "Chapa payment initiation failed" });
    }
  } catch (error) {
    console.error("Chapa Init Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Chapa server error" });
  }
};

// Verify Chapa Payment
export const verifyChapaPayment = async (req, res) => {
  const { bookingId } = req.params;
  const { tx_ref } = req.query;

  if (!tx_ref) {
    return res.redirect(
      `http://localhost:3000/bookings/failed?bookingId=${bookingId}`
    );
  }

  try {
    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = verifyRes.data.data;

    if (data.status === "success") {
      // TODO: Update booking in DB as paid
      return res.redirect(
        `http://localhost:3000/bookings/success?bookingId=${bookingId}`
      );
    } else {
      return res.redirect(
        `http://localhost:3000/bookings/failed?bookingId=${bookingId}`
      );
    }
  } catch (err) {
    console.error("Chapa Verify Error:", err.response?.data || err.message);
    return res.redirect(
      `http://localhost:3000/bookings/failed?bookingId=${bookingId}`
    );
  }
};
