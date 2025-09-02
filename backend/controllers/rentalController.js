// controllers/productReservationController.js
import Reservation from "../models/ProductReservation.js";
import { transporter } from "../config/email.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const createReservation = async (req, res) => {
  try {
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
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle optional payment evidence
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // Default payment status pending until admin verification
    const paymentStatus = "pending";

    // Save reservation
    const reservation = await Reservation.create({
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
      paymentEvidence,
    });

    const adminEmail = process.env.ADMIN_EMAIL;

    // Email to Admin
    const adminMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Reservation - ${listingTitle}`,
      html: `
        <h2>New Reservation Submitted</h2>
        <p><strong>Property:</strong> ${listingTitle}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong></p>
               <img src="cid:paymentEvidenceImg" alt="Payment Evidence" style="max-width:400px;"/>`
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
      subject: `Your Reservation - ${listingTitle}`,
      html: `
        <h2>Reservation Pending</h2>
        <p>Dear ${name},</p>
        <p>Your reservation for:</p>
        <ul>
          <li><strong>Property:</strong> ${listingTitle}</li>
          <li><strong>Check-in:</strong> ${checkIn}</li>
          <li><strong>Check-out:</strong> ${checkOut}</li>
          <li><strong>Nights:</strong> ${nights}</li>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Payment Status:</strong> ${paymentStatus}</li>
          ${
            paymentEvidence
              ? `<li><strong>Payment Evidence:</strong> uploaded</li>`
              : ""
          }
        </ul>
        <p>Your payment is currently pending. The admin will verify it and confirm your booking once verified.</p>
        <hr/>
        <p><em>This is an automated email. Do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res
      .status(201)
      .json({ message: "Reservation created & emails sent", reservation });
  } catch (err) {
    console.error("Reservation creation error:", err);
    res.status(500).json({ error: "Server error while creating reservation" });
  }
};
