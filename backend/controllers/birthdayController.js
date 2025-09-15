// controllers/birthdayController.js
import BirthdayBooking from "../models/BirthdayBooking.js";
import { transporter } from "../config/email.js";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const createBirthdayBooking = async (req, res) => {
  try {
    // Extract data from FormData
    const {
      name,
      email,
      phone,
      birthdayDate,
      guests,
      selectedServices,
      specialRequests,
      amount,
      paymentMethod,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !birthdayDate ||
      !guests ||
      !selectedServices ||
      !amount ||
      !paymentMethod
    ) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" });
    }

    // Parse selectedServices (sent as JSON string from FormData)
    let services = [];
    try {
      services = JSON.parse(selectedServices);
      if (!Array.isArray(services)) services = [];
    } catch (err) {
      return res.status(400).json({ error: "Invalid selectedServices format" });
    }

    // Handle file upload
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const uploadPath = path.join(uploadDir, Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // Create booking
    const booking = await BirthdayBooking.create({
      name,
      email,
      phone: phone || "",
      birthdayDate: new Date(birthdayDate),
      guests: Number(guests),
      selectedServices: services,
      specialRequests: specialRequests || "",
      amount: Number(amount),
      paymentMethod,
      paymentStatus: "pending",
      paymentEvidence,
    });

    // Email to Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Birthday Booking - ${name}`,
      html: `
        <h2>New Birthday Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Birthday Date:</strong> ${birthdayDate}</p>
        <p><strong>Services:</strong> ${services.join(", ")}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> Pending (waiting for admin verification)</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong><br/><img src="cid:paymentEvidenceImg" style="max-width:400px;"/></p>`
            : ""
        }
      `,
      attachments: paymentEvidence
        ? [
            {
              filename: path.basename(paymentEvidence),
              path: paymentEvidence,
              cid: "paymentEvidenceImg",
            },
          ]
        : [],
    };

    // Email to User
    const userMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Birthday Booking - ${name}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your booking! Here are your booking details:</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Birthday Date:</strong> ${birthdayDate}</p>
        <p><strong>Services:</strong> ${services.join(", ")}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p>Your booking is currently pending verification.</p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    // Respond with booking
    res
      .status(201)
      .json({ message: "Birthday booking created & emails sent!", booking });
  } catch (err) {
    console.error("Birthday booking error:", err);
    res.status(500).json({ error: "Server error while creating booking" });
  }
};

// ✅ Get all birthday bookings
export const getBirthdayBookings = async (req, res) => {
  try {
    const bookings = await BirthdayBooking.find();
    res.json(bookings);
  } catch (err) {
    console.error("Fetch birthday bookings error:", err);
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
};
