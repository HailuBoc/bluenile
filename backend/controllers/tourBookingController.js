import TourBooking from "../models/TourBooking.js";
import path from "path";
import { transporter } from "../config/email.js"; // Make sure you have transporter setup
import fetch from "node-fetch";

// Create a new tour booking
export const createTourBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      tourDate,
      numberOfPeople,
      vipService,
      message,
      paymentMethod,
      totalAmount,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !tourDate ||
      !numberOfPeople ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle document upload for Telebirr/CBE
    let documentPath = null;
    if (req.files && req.files.document) {
      const file = req.files.document;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      documentPath = uploadPath;
    }

    // Create booking
    const booking = await TourBooking.create({
      fullName,
      email,
      phone,
      tourDate,
      numberOfPeople,
      vipService,
      message,
      paymentMethod,
      totalAmount,
      document: documentPath,
      verified: paymentMethod === "Chapa",
      paymentStatus: paymentMethod === "Chapa" ? "Paid" : "Pending",
    });

    // Email Notifications
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminMailOptions = {
      from: `"Tour Booking" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Tour Booking - ${fullName}`,
      html: `
        <h2>New Tour Booking</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Tour Date:</strong> ${tourDate}</p>
        <p><strong>Number of People:</strong> ${numberOfPeople}</p>
        <p><strong>VIP Service:</strong> ${vipService || "None"}</p>
        <p><strong>Total Amount:</strong> ${totalAmount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
        ${
          documentPath
            ? `<p><strong>Payment Evidence:</strong> <a href="${documentPath}">View File</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Tour Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Tour Booking - ${fullName}`,
      html: `
        <h2>Booking ${
          booking.paymentStatus === "Paid" ? "Confirmed" : "Pending"
        }</h2>
        <p>Dear ${fullName},</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Tour Date:</strong> ${tourDate}</li>
          <li><strong>Number of People:</strong> ${numberOfPeople}</li>
          <li><strong>VIP Service:</strong> ${vipService || "None"}</li>
          <li><strong>Total Amount:</strong> ${totalAmount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Payment Status:</strong> ${booking.paymentStatus}</li>
          ${
            documentPath
              ? "<li><strong>Payment Evidence:</strong> uploaded</li>"
              : ""
          }
        </ul>
        <p>${
          booking.paymentStatus === "Pending"
            ? "Please complete your payment. Admin will verify your evidence."
            : "Your payment is completed and booking is confirmed!"
        }</p>
        <hr/>
        <p><em>Automated email, do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(201).json({ status: "success", booking });
  } catch (err) {
    console.error("Tour booking error:", err);
    res.status(500).json({ error: "Server error while creating booking" });
  }
};

// Get all bookings
export const getTourBookings = async (req, res) => {
  try {
    const bookings = await TourBooking.find({});
    res.json({ status: "success", bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching bookings" });
  }
};

// Get booking by ID
export const getTourBookingById = async (req, res) => {
  try {
    const booking = await TourBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ status: "success", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching booking" });
  }
};

// Initialize Chapa payment
export const initChapaPayment = async (req, res) => {
  try {
    const { amount, currency, email, fullName, bookingId } = req.body;

    if (!amount || !email || !fullName || !bookingId)
      return res.status(400).json({ error: "Missing required fields" });

    const [first_name, ...last] = fullName.split(" ");
    const last_name = last.join(" ") || "Customer";

    const payload = {
      amount: amount.toString(),
      currency: currency || "ETB",
      email,
      first_name,
      last_name,
      tx_ref: `tour_${bookingId}`,
      callback_url: `http://localhost:3000/tours/success?bookingId=${bookingId}`,
    };

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res
        .status(500)
        .json({ error: "Invalid response from Chapa", raw: text });
    }

    if (data.status === "success") {
      return res.json({ checkout_url: data.data.checkout_url });
    } else {
      return res
        .status(400)
        .json({ error: data.message || "Chapa initialization failed" });
    }
  } catch (err) {
    console.error("Chapa error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
