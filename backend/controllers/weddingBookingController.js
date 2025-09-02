import WeddingBooking from "../models/WeddingsBooking.js";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { transporter } from "../config/email.js"; // Make sure transporter is setup

// Create a new wedding booking
export const createWedding = async (req, res) => {
  try {
    const {
      name,
      email,
      phone, // ✅ added
      date,
      guests,
      marriageType,
      selectedServices,
      specialRequests,
      paymentMethod,
      totalAmount,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !guests ||
      !marriageType ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse services array if sent as JSON
    let services = [];
    try {
      services = JSON.parse(selectedServices);
    } catch {
      services = [];
    }

    // Handle file upload
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // Create booking in DB
    const wedding = await WeddingBooking.create({
      name,
      email,
      phone, // ✅ saved
      date,
      guests,
      marriageType,
      selectedServices: services,
      specialRequests,
      paymentMethod,
      totalAmount,
      paymentEvidence,
      paymentStatus: paymentMethod === "Chapa" ? "completed" : "pending", // Chapa auto-confirmed
    });

    // Send email notifications
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminMailOptions = {
      from: `"Wedding Booking" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Wedding Booking - ${name}`,
      html: `
        <h2>New Wedding Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Marriage Type:</strong> ${marriageType}</p>
        <p><strong>Selected Services:</strong> ${services.join(", ")}</p>
        <p><strong>Total Amount:</strong> ${totalAmount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${wedding.paymentStatus}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidence}">View File</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Wedding Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Wedding Booking - ${name}`,
      html: `
        <h2>Booking ${
          wedding.paymentStatus === "completed" ? "Confirmed" : "Pending"
        }</h2>
        <p>Dear ${name},</p>
        <p>Your wedding booking details:</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Marriage Type:</strong> ${marriageType}</li>
          <li><strong>Selected Services:</strong> ${services.join(", ")}</li>
          <li><strong>Total Amount:</strong> ${totalAmount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Payment Status:</strong> ${wedding.paymentStatus}</li>
          ${
            paymentEvidence
              ? "<li><strong>Payment Evidence:</strong> uploaded</li>"
              : ""
          }
        </ul>
        <p>${
          wedding.paymentStatus === "pending"
            ? "Your payment is pending. Admin will verify your evidence."
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

    return res.status(201).json({ status: "success", booking: wedding });
  } catch (err) {
    console.error("Wedding booking error:", err);
    return res
      .status(500)
      .json({ error: "Server error while creating booking" });
  }
};

// Get all wedding bookings
export const getWeddingBookings = async (req, res) => {
  try {
    const bookings = await WeddingBooking.find({});
    res.json({ status: "success", bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching bookings" });
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
      tx_ref: `booking_${bookingId}`,
      callback_url: "http://localhost:3000/weddings", // frontend callback
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
