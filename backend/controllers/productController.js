import Reservation from "../models/ProductReservation.js";
import path from "path";
import { transporter } from "../config/email.js"; // Make sure transporter is configured

export const createReservation = async (req, res) => {
  try {
    const {
      listingId,
      listingTitle,
      name,
      phone,
      email,
      checkIn,
      checkOut,
      nights,
      amount,
      paymentMethod,
    } = req.body;

    // ✅ Validate required fields
    if (
      !listingId ||
      !listingTitle ||
      !name ||
      !phone ||
      !email ||
      !checkIn ||
      !checkOut ||
      !nights ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Handle optional payment evidence
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // ✅ Save reservation
    const reservation = await Reservation.create({
      listingId,
      listingTitle,
      name,
      phone,
      email,
      checkIn,
      checkOut,
      nights,
      amount,
      paymentMethod,
      paymentEvidence,
    });

    // ✅ Prepare email notifications
    const adminMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Reservation - ${listingTitle}`,
      html: `
        <h2>New Reservation</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Listing:</strong> ${listingTitle} (ID: ${listingId})</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidence}">View</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Reservation - ${listingTitle}`,
      html: `
        <h2>Reservation Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reserving <strong>${listingTitle}</strong>.</p>
        <ul>
          <li><strong>Check-In:</strong> ${checkIn}</li>
          <li><strong>Check-Out:</strong> ${checkOut}</li>
          <li><strong>Nights:</strong> ${nights}</li>
          <li><strong>Amount:</strong> ${amount}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          ${
            paymentEvidence
              ? "<li><strong>Payment Evidence:</strong> Uploaded</li>"
              : ""
          }
        </ul>
        <p>We will confirm your reservation shortly.</p>
        <hr/>
        <p><em>Automated email, please do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return res.status(201).json({ status: "success", reservation });
  } catch (err) {
    console.error("Reservation create error:", err);
    return res
      .status(500)
      .json({ error: "Server error while creating reservation" });
  }
};
