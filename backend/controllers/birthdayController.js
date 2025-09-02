import BirthdayBooking from "../models/BirthdayBooking.js";
import { transporter } from "../config/email.js";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// ✅ Create birthday booking
export const createBirthdayBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      birthdayDate,
      guests,
      selectedServices,
      specialRequests,
      amount,
      paymentMethod,
    } = req.body;

    if (
      !name ||
      !email ||
      !birthdayDate ||
      !guests ||
      !selectedServices ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle file upload
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    const booking = await BirthdayBooking.create({
      name,
      email,
      birthdayDate,
      guests,
      selectedServices: JSON.parse(selectedServices),
      specialRequests: specialRequests || "",
      amount,
      paymentMethod,
      paymentEvidence,
    });

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    await transporter.sendMail({
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Birthday Booking - ${name}`,
      html: `
        <h2>New Birthday Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Birthday Date:</strong> ${birthdayDate}</p>
        <p><strong>Services:</strong> ${selectedServices}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> Pending (waiting for admin verification)</p>
        ${paymentEvidence ? `<p>Payment Evidence: ${paymentEvidence}</p>` : ""}
      `,
    });

    // Send email to user
    await transporter.sendMail({
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Birthday Booking - ${name}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your booking! Here are your booking details:</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Birthday Date:</strong> ${birthdayDate}</p>
        <p><strong>Services:</strong> ${selectedServices}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p>Your booking is currently pending verification.</p>
      `,
    });

    res.status(201).json({ message: "Birthday booking created!", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all bookings
export const getBirthdayBookings = async (req, res) => {
  try {
    const bookings = await BirthdayBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
