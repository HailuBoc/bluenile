// controllers/reservationController.js
import Reservation from "../models/ReservationRental.js";
import { transporter } from "../config/email.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const createReservation = async (req, res) => {
  try {
    // Fields come from FormData
    const {
      listingId,
      listingTitle,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      nights,
      amount,
      paymentMethod,
      paymentStatus,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (
      !listingId ||
      !listingTitle ||
      !name ||
      !email ||
      !phone ||
      !checkIn ||
      !checkOut ||
      !nights ||
      !amount ||
      !paymentMethod ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle file upload
    let paymentEvidence = "";
    if (req.file) {
      paymentEvidence = req.file.path;
    }

    const reservation = await Reservation.create({
      listingId,
      listingTitle,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      nights: Number(nights),
      amount: Number(amount),
      paymentMethod,
      paymentStatus,
      paymentEvidence,
      specialRequests: specialRequests || "",
    });

    // === 📧 Email Notifications ===
    const adminEmail = process.env.ADMIN_EMAIL;

    // Email to Admin
    const adminMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Reservation - ${listingTitle}`,
      html: `
        <h2>New Reservation</h2>
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || "None"}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> Attached file</p>`
            : ""
        }
      `,
      attachments: paymentEvidence
        ? [
            {
              filename: path.basename(paymentEvidence),
              path: paymentEvidence,
            },
          ]
        : [],
    };

    // Email to Client
    const userMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Reservation - ${listingTitle}`,
      html: `
        <h2>Reservation Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your reservation! Here are your booking details:</p>
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> ${paymentStatus}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || "None"}</p>
        <br/>
        <p>We will contact you soon for further details.</p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    // === ✅ Respond to client ===
    res
      .status(201)
      .json({ message: "Reservation created & emails sent", reservation });
  } catch (err) {
    console.error("Reservation creation error:", err);
    res.status(500).json({ error: "Server error while creating reservation" });
  }
};
