// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";

// // Initialize Chapa Payment
// export const createChapaPayment = async (req, res) => {
//   try {
//     const { amount, currency, email, fullName, bookingId } = req.body;

//     if (!amount || !email || !fullName || !bookingId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const [firstName, ...rest] = fullName.split(" ");
//     const lastName = rest.join(" ") || "NA";

//     const data = {
//       amount: String(amount),
//       currency: currency || "ETB",
//       email,
//       first_name: firstName,
//       last_name: lastName,
//       tx_ref: uuidv4(),
//       callback_url: `http://localhost:10000/bookings/pay/chapa/verify/${bookingId}`,
//       return_url: `http://localhost:3000/bookings/success?bookingId=${bookingId}`,
//     };

//     const chapaRes = await axios.post(
//       "https://api.chapa.co/v1/transaction/initialize",
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (chapaRes.data?.status === "success") {
//       return res.json({ checkout_url: chapaRes.data.data.checkout_url });
//     } else {
//       return res
//         .status(500)
//         .json({ message: "Chapa payment initiation failed" });
//     }
//   } catch (error) {
//     console.error("Chapa Init Error:", error.response?.data || error.message);
//     res.status(500).json({ message: "Chapa server error" });
//   }
// };

// // Verify Chapa Payment
// export const verifyChapaPayment = async (req, res) => {
//   const { bookingId } = req.params;
//   const { tx_ref } = req.query;

//   if (!tx_ref) {
//     return res.redirect(
//       `http://localhost:3000/bookings/failed?bookingId=${bookingId}`
//     );
//   }

//   try {
//     const verifyRes = await axios.get(
//       `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
//         },
//       }
//     );

//     const data = verifyRes.data.data;

//     if (data.status === "success") {
//       // TODO: Update booking in DB as paid
//       return res.redirect(
//         `http://localhost:3000/bookings/success?bookingId=${bookingId}`
//       );
//     } else {
//       return res.redirect(
//         `http://localhost:3000/bookings/failed?bookingId=${bookingId}`
//       );
//     }
//   } catch (err) {
//     console.error("Chapa Verify Error:", err.response?.data || err.message);
//     return res.redirect(
//       `http://localhost:3000/bookings/failed?bookingId=${bookingId}`
//     );
//   }
// };import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:10000";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * Initialize Payment (Chapa, Telebirr, M-Pesa)
 * Endpoint: POST /bookings/pay/:method
 */
export const createPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, phone, bookingId } = req.body;
    const { method } = req.params;

    if (!amount || !email || !fullName || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "NA";

    const tx_ref = uuidv4();
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
        callback_url: `${SERVER_URL}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
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
        checkout_url = chapaRes.data.data.checkout_url;
      } else {
        return res
          .status(500)
          .json({ message: "Chapa payment initiation failed" });
      }
    }

    // 🟡 Telebirr
    else if (method === "telebirr") {
      const telebirrInitUrl =
        process.env.TELEBIRR_INIT_URL || "https://api.telebirr.com/init";
      const payload = {
        amount,
        msisdn: phone || "",
        tx_ref,
        callback_url: `${SERVER_URL}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
      };

      const teleRes = await axios.post(telebirrInitUrl, payload, {
        headers: {
          Authorization: `Bearer ${process.env.TELEBIRR_SECRET_KEY || ""}`,
          "Content-Type": "application/json",
        },
      });

      if (teleRes.data?.checkout_url) {
        checkout_url = teleRes.data.checkout_url;
      } else {
        return res.status(500).json({
          message: "Telebirr payment initiation failed",
          details: teleRes.data,
        });
      }
    }

    // 🔵 M-Pesa
    else if (method === "mpesa") {
      const mpesaInitUrl =
        process.env.MPESA_INIT_URL || "https://api.safaricom.co.ke/mpesa/init";
      const payload = {
        amount,
        phone: phone || "",
        tx_ref,
        callback_url: `${SERVER_URL}/bookings/pay/${method}/verify/${bookingId}`,
        return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
      };

      const mpesaRes = await axios.post(mpesaInitUrl, payload, {
        headers: {
          Authorization: `Bearer ${process.env.MPESA_SECRET_KEY || ""}`,
          "Content-Type": "application/json",
        },
      });

      if (mpesaRes.data?.checkout_url) {
        checkout_url = mpesaRes.data.checkout_url;
      } else {
        return res.status(500).json({
          message: "M-Pesa payment initiation failed",
          details: mpesaRes.data,
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Return the checkout URL
    return res.json({ checkout_url, tx_ref });
  } catch (error) {
    console.error("Payment Init Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment server error" });
  }
};

/**
 * Verify Payment (All methods)
 * Endpoint: GET /bookings/pay/:method/verify/:bookingId
 */
export const verifyPayment = async (req, res) => {
  const { method, bookingId } = req.params;
  const { tx_ref } = req.query;

  const clientSuccess = `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`;
  const clientFail = `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`;

  try {
    let success = false;

    // 🟢 Chapa
    if (method === "chapa") {
      const verifyRes = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        }
      );
      success = verifyRes.data?.data?.status === "success";
    }

    // 🟡 Telebirr (placeholder)
    else if (method === "telebirr") {
      // Replace with Telebirr verify API
      success = true; // assume success for now
    }

    // 🔵 M-Pesa (placeholder)
    else if (method === "mpesa") {
      // Replace with M-Pesa verify API
      success = true; // assume success for now
    }

    return res.redirect(success ? clientSuccess : clientFail);
  } catch (err) {
    console.error("Payment Verify Error:", err.response?.data || err.message);
    return res.redirect(clientFail);
  }
};
