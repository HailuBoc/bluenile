import GeneralEventBooking from "../models/generalEventBooking.js";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { transporter } from "../config/email.js"; // Make sure transporter is configured

// Create a new general event booking
export const createGeneralEventBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      date,
      guests,
      services,
      specialRequests,
      paymentMethod,
      amount,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !email ||
      !date ||
      !guests ||
      !paymentMethod ||
      !amount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse services
    let serviceList = [];
    try {
      serviceList = services ? JSON.parse(services) : [];
    } catch {
      serviceList = [];
    }

    // Handle file upload (Telebirr / CBE)
    let paymentEvidence = null;
    if (req.files?.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // Create booking
    const booking = await GeneralEventBooking.create({
      name,
      phone,
      email,
      date,
      guests,
      services: serviceList,
      specialRequests,
      paymentMethod,
      paymentEvidence,
      amount,
      status: paymentMethod === "Chapa" ? "paid" : "pending",
    });

    // Email notifications
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminMailOptions = {
      from: `"General Event Booking" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New General Event Booking - ${name}`,
      html: `
        <h2>New General Event Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Services:</strong> ${serviceList.join(", ")}</p>
        <p><strong>Total Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidence}">View File</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"General Event Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your General Event Booking - ${name}`,
      html: `
        <h2>Booking ${booking.status === "paid" ? "Confirmed" : "Pending"}</h2>
        <p>Dear ${name},</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Services:</strong> ${serviceList.join(", ")}</li>
          <li><strong>Total Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Status:</strong> ${booking.status}</li>
          ${
            paymentEvidence
              ? "<li><strong>Payment Evidence:</strong> uploaded</li>"
              : ""
          }
        </ul>
        <p>${
          booking.status === "pending"
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

    res.status(201).json({ status: "success", booking });
  } catch (err) {
    console.error("General event booking error:", err);
    res.status(500).json({ error: "Server error while creating booking" });
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
      callback_url: "http://localhost:3000/general-events",
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

// Get all general event bookings (admin)
export const getGeneralEventBookings = async (req, res) => {
  try {
    const bookings = await GeneralEventBooking.find({});
    res.json({ status: "success", bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching bookings" });
  }
};

// Get booking by ID
export const getGeneralEventBookingById = async (req, res) => {
  try {
    const booking = await GeneralEventBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ status: "success", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching booking" });
  }
};
