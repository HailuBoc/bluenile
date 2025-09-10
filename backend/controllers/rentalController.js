// controllers/rentalController.js
import Reservation from "../models/ReservationRental.js";
import { transporter } from "../config/email.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const createReservation = async (req, res) => {
  try {
    const {
      listingId,
      propertyId,
      listingTitle,
      propertyTitle,
      name,
      fullName,
      email,
      phone,
      checkIn,
      checkInDate,
      checkOut,
      checkOutDate,
      nights,
      amount,
      totalAmount,
      paymentMethod,
    } = req.body;

    // ✅ normalize values
    const finalListingId = listingId || propertyId;
    const finalListingTitle = listingTitle || propertyTitle;
    const finalName = name || fullName;
    const finalCheckIn = checkIn || checkInDate;
    const finalCheckOut = checkOut || checkOutDate;
    const finalAmount = amount || totalAmount;

    // ✅ validate required fields
    if (
      !finalListingId ||
      !finalListingTitle ||
      !finalName ||
      !email ||
      !phone ||
      !finalCheckIn ||
      !finalCheckOut ||
      !nights ||
      !finalAmount ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ handle optional file upload
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // default payment status
    const paymentStatus = paymentMethod === "Chapa" ? "pending" : "pending"; // always pending until admin verifies

    // ✅ save reservation
    const reservation = await Reservation.create({
      listingId: finalListingId,
      listingTitle: finalListingTitle,
      name: finalName,
      email,
      phone,
      checkIn: finalCheckIn,
      checkOut: finalCheckOut,
      nights,
      amount: finalAmount,
      paymentMethod,
      paymentStatus,
      paymentEvidence,
    });

    const adminEmail = process.env.ADMIN_EMAIL;

    // 📧 email to Admin
    const adminMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Reservation - ${finalListingTitle}`,
      html: `
        <h2>New Reservation Submitted</h2>
        <p><strong>Property:</strong> ${finalListingTitle}</p>
        <p><strong>Name:</strong> ${finalName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Check-in:</strong> ${finalCheckIn}</p>
        <p><strong>Check-out:</strong> ${finalCheckOut}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Amount:</strong> ${finalAmount} ETB</p>
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

    // 📧 email to User
    const userMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Reservation - ${finalListingTitle}`,
      html: `
        <h2>Reservation Pending</h2>
        <p>Dear ${finalName},</p>
        <p>Your reservation for:</p>
        <ul>
          <li><strong>Property:</strong> ${finalListingTitle}</li>
          <li><strong>Check-in:</strong> ${finalCheckIn}</li>
          <li><strong>Check-out:</strong> ${finalCheckOut}</li>
          <li><strong>Nights:</strong> ${nights}</li>
          <li><strong>Amount:</strong> ${finalAmount} ETB</li>
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

    res.status(201).json({
      message: "Reservation created & emails sent",
      reservation,
    });
  } catch (err) {
    console.error("Reservation creation error:", err);
    res.status(500).json({ error: "Server error while creating reservation" });
  }
};
