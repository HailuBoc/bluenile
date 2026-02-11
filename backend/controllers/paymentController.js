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
// };
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const {
  CHAPA_SECRET_KEY,
  TELEBIRR_MERCHANT_APP_ID,
  TELEBIRR_FABRIC_APP_ID,
  TELEBIRR_SHORT_CODE,
  TELEBIRR_APP_SECRET,
  TELEBIRR_NOTIFY_URL,
  TELEBIRR_RETURN_URL,
  CLIENT_URL,
  SERVER_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
} = process.env;

/**
 * Universal Payment Controller
 * Supports: chapa, telebirr, mpesa
 */
export const createPayment = async (req, res) => {
  try {
    const { method } = req.params; // "chapa", "telebirr", or "mpesa"
    const { amount, email, fullName, bookingId, phone } = req.body;

    if (!amount || !fullName || !bookingId)
      return res.status(400).json({ message: "Missing required fields" });

    switch (method.toLowerCase()) {
      case "chapa":
        return initChapaPayment(res, { amount, email, fullName, bookingId });
      case "telebirr":
        return initTelebirrPayment(res, { amount, fullName, bookingId });
      case "mpesa":
        return initMpesaPayment(res, { amount, fullName, bookingId, phone });
      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (err) {
    console.error("Payment Error:", err.message);
    return res
      .status(500)
      .json({ message: "Payment server error", error: err.message });
  }
};

/**
 * Verify Payments
 */
export const verifyPayment = async (req, res) => {
  try {
    const { method, bookingId } = req.params;
    const { tx_ref } = req.query;

    if (!tx_ref) {
      return res.redirect(
        `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`
      );
    }

    switch (method.toLowerCase()) {
      case "chapa":
        return verifyChapaPayment(res, bookingId, tx_ref);
      case "telebirr":
        return verifyTelebirrPayment(res, bookingId, tx_ref);
      case "mpesa":
        return verifyMpesaPayment(res, bookingId, tx_ref, req);
      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (err) {
    console.error("Verify Error:", err.message);
    return res.redirect(
      `${CLIENT_URL}/bookings/failed?bookingId=${req.params.bookingId}`
    );
  }
};

//
// ────────────────────────────────
//   CHAPA
// ────────────────────────────────
async function initChapaPayment(res, { amount, email, fullName, bookingId }) {
  try {
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "NA";

    const data = {
      amount: String(amount),
      currency: "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: uuidv4(),
      callback_url: `${SERVER_URL}/bookings/pay/chapa/verify/${bookingId}`,
      return_url: `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`,
    };

    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      data,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
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
  } catch (err) {
    console.error("Chapa Init Error:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ message: "Chapa Init Error", error: err.message });
  }
}

async function verifyChapaPayment(res, bookingId, tx_ref) {
  try {
    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      { headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` } }
    );

    if (verifyRes.data.data.status === "success") {
      return res.redirect(
        `${CLIENT_URL}/bookings/success?bookingId=${bookingId}`
      );
    } else {
      return res.redirect(
        `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`
      );
    }
  } catch (err) {
    console.error("Chapa Verify Error:", err.response?.data || err.message);
    return res.redirect(`${CLIENT_URL}/bookings/failed?bookingId=${bookingId}`);
  }
}

//
// ────────────────────────────────
//   TELEBIRR (Fixed Integration)
// ────────────────────────────────
async function initTelebirrPayment(res, { amount, fullName, bookingId }) {
  try {
    // Validate required environment variables
    if (
      !TELEBIRR_MERCHANT_APP_ID ||
      !TELEBIRR_APP_SECRET ||
      !TELEBIRR_SHORT_CODE
    ) {
      return res.status(500).json({
        message:
          "Telebirr configuration missing. Please check environment variables.",
      });
    }

    const outTradeNo = `TB-${bookingId}-${Date.now()}`;
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const nonce = uuidv4();

    // Create the signature string in the correct order
    const signString = `appId=${TELEBIRR_MERCHANT_APP_ID}&appSecret=${TELEBIRR_APP_SECRET}&nonce=${nonce}&outTradeNo=${outTradeNo}&receiveName=${encodeURIComponent(
      fullName
    )}&returnUrl=${encodeURIComponent(
      TELEBIRR_RETURN_URL
    )}&shortCode=${TELEBIRR_SHORT_CODE}&subject=${encodeURIComponent(
      "Booking Payment"
    )}&timeoutExpress=30&timestamp=${timestamp}&totalAmount=${amount}`;

    // Generate SHA256 hash
    const sign = crypto.createHash("sha256").update(signString).digest("hex");

    const payload = {
      appId: TELEBIRR_MERCHANT_APP_ID,
      outTradeNo,
      nonce,
      timestamp,
      totalAmount: amount,
      subject: "Booking Payment",
      shortCode: TELEBIRR_SHORT_CODE,
      returnUrl: TELEBIRR_RETURN_URL,
      notifyUrl: TELEBIRR_NOTIFY_URL,
      receiveName: fullName,
      sign,
    };

    console.log("Telebirr Payload:", JSON.stringify(payload, null, 2));

    // Try both sandbox and production endpoints
    const endpoints = [
      "https://openapi.telebirr.com/api/payment/v1/merchant/init",
      "https://sandboxapi.telebirr.com/api/payment/v1/merchant/init",
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Telebirr endpoint: ${endpoint}`);

        const response = await axios.post(endpoint, payload, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 30000, // 30 second timeout
        });

        console.log(
          "Telebirr Response:",
          JSON.stringify(response.data, null, 2)
        );

        if (response.data?.code === 200 && response.data?.data?.toPayUrl) {
          return res.json({
            checkout_url: response.data.data.toPayUrl,
            transaction_id: outTradeNo,
          });
        } else if (response.data?.code === 200 && response.data?.data?.payUrl) {
          return res.json({
            checkout_url: response.data.data.payUrl,
            transaction_id: outTradeNo,
          });
        } else {
          lastError = response.data;
        }
      } catch (endpointError) {
        console.error(
          `Telebirr endpoint ${endpoint} failed:`,
          endpointError.response?.data || endpointError.message
        );
        lastError = endpointError.response?.data || endpointError.message;
      }
    }

    return res.status(500).json({
      message: "Telebirr payment initiation failed",
      detail: lastError,
      suggestion: "Please check your Telebirr credentials and try again",
    });
  } catch (err) {
    console.error("Telebirr Init Error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Telebirr Init Error",
      error: err.message,
    });
  }
}

async function verifyTelebirrPayment(res, bookingId, tx_ref) {
  // Telebirr doesn’t provide verify endpoint in sandbox
  // Simulate success for testing
  return res.redirect(`${CLIENT_URL}/bookings/success?bookingId=${bookingId}`);
}

//
// ────────────────────────────────
//   M-PESA (STK Push Integration)
// ────────────────────────────────
async function initMpesaPayment(res, { amount, fullName, bookingId, phone }) {
  try {
    // Validate required environment variables
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_PASSKEY) {
      return res.status(500).json({
        message:
          "M-Pesa configuration missing. Please check environment variables.",
      });
    }

    // Validate phone number format (should be 254XXXXXXXXX for Kenya)
    if (!phone || !phone.match(/^254\d{9}$/)) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Use format: 254XXXXXXXXX (e.g., 254708374149)",
      });
    }

    // Get access token
    const accessToken = await getMpesaAccessToken();
    if (!accessToken) {
      return res.status(500).json({
        message: "Failed to get M-Pesa access token",
      });
    }

    // Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
    const password = Buffer.from(`174379${MPESA_PASSKEY}${timestamp}`).toString(
      "base64"
    );

    // Generate transaction reference
    const transactionRef = `MP-${bookingId}-${Date.now()}`;

    const stkPushPayload = {
      BusinessShortCode: "174379", // M-Pesa test business short code
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount), // M-Pesa requires integer amounts
      PartyA: phone,
      PartyB: "174379",
      PhoneNumber: phone,
      CallBackURL: `${SERVER_URL}/bookings/pay/mpesa/verify/${bookingId}`,
      AccountReference: transactionRef,
      TransactionDesc: `Payment for booking ${bookingId}`,
    };

    console.log(
      "M-Pesa STK Push Payload:",
      JSON.stringify(stkPushPayload, null, 2)
    );

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log(
      "M-Pesa STK Push Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (response.data.ResponseCode === "0") {
      return res.json({
        message:
          "STK Push sent successfully. Please check your phone to complete payment.",
        checkout_url: `${CLIENT_URL}/bookings/pending?bookingId=${bookingId}&method=mpesa`,
        transaction_id: transactionRef,
        merchant_request_id: response.data.MerchantRequestID,
        checkout_request_id: response.data.CheckoutRequestID,
      });
    } else {
      return res.status(500).json({
        message: "M-Pesa STK Push failed",
        error: response.data.ResponseDescription,
        response_code: response.data.ResponseCode,
      });
    }
  } catch (err) {
    console.error("M-Pesa Init Error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "M-Pesa Init Error",
      error: err.response?.data?.errorMessage || err.message,
    });
  }
}

// Helper function to get M-Pesa access token
async function getMpesaAccessToken() {
  try {
    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 30000,
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error("M-Pesa Token Error:", err.response?.data || err.message);
    return null;
  }
}

async function verifyMpesaPayment(res, bookingId, tx_ref, req) {
  try {
    // M-Pesa sends callback data in the request body
    const callbackData = req.body;

    console.log("M-Pesa Callback Data:", JSON.stringify(callbackData, null, 2));

    if (callbackData.Body && callbackData.Body.stkCallback) {
      const stkCallback = callbackData.Body.stkCallback;

      if (stkCallback.ResultCode === 0) {
        // Payment successful
        const result = stkCallback.CallbackMetadata?.Item;
        const amount = result?.find((item) => item.Name === "Amount")?.Value;
        const mpesaReceiptNumber = result?.find(
          (item) => item.Name === "MpesaReceiptNumber"
        )?.Value;
        const transactionDate = result?.find(
          (item) => item.Name === "TransactionDate"
        )?.Value;
        const phoneNumber = result?.find(
          (item) => item.Name === "PhoneNumber"
        )?.Value;

        console.log("M-Pesa Payment Success:", {
          amount,
          mpesaReceiptNumber,
          transactionDate,
          phoneNumber,
          bookingId,
        });

        // TODO: Update booking status in database
        // await updateBookingStatus(bookingId, 'paid', {
        //   mpesa_receipt: mpesaReceiptNumber,
        //   transaction_date: transactionDate,
        //   amount: amount
        // });

        return res.redirect(
          `${CLIENT_URL}/bookings/success?bookingId=${bookingId}&receipt=${mpesaReceiptNumber}`
        );
      } else {
        // Payment failed
        console.log("M-Pesa Payment Failed:", stkCallback.ResultDesc);
        return res.redirect(
          `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}&reason=${encodeURIComponent(
            stkCallback.ResultDesc
          )}`
        );
      }
    } else {
      // Invalid callback data
      console.log("Invalid M-Pesa callback data");
      return res.redirect(
        `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}&reason=invalid_callback`
      );
    }
  } catch (err) {
    console.error("M-Pesa Verify Error:", err.message);
    return res.redirect(
      `${CLIENT_URL}/bookings/failed?bookingId=${bookingId}&reason=verification_error`
    );
  }
}
