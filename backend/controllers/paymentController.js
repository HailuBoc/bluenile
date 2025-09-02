import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const createChapaPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, bookingId } = req.body;

    if (!amount || !email || !fullName || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Split fullName into first and last
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "NA";

    const data = {
      amount: String(amount), // keep as string
      currency: currency || "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: uuidv4(),
      callback_url: `http://localhost:5000/api/payments/chapa/verify/${bookingId}`,
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

    if (chapaRes.data && chapaRes.data.status === "success") {
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
