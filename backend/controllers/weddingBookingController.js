import WeddingBooking from "../models/WeddingsBooking.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const createWeddingBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      date,
      guests,
      marriageType,
      selectedServices,
      specialRequests,
      paymentMethod,
      totalAmount,
      paymentEvidence = "", // now just a string from frontend
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !guests ||
      !marriageType ||
      !selectedServices ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create booking
    const booking = await WeddingBooking.create({
      name,
      email,
      phone,
      date: new Date(date),
      guests: Number(guests),
      marriageType,
      selectedServices,
      specialRequests: specialRequests || "",
      paymentMethod,
      paymentEvidence,
      totalAmount: Number(totalAmount),
      paymentStatus: "pending",
    });

    // Send emails
    const adminMailOptions = {
      from: `"Wedding Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Wedding Booking - ${name}`,
      html: `
        <h2>New Wedding Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Type:</strong> ${marriageType}</p>
        <p><strong>Services:</strong> ${selectedServices.join(", ")}</p>
        <p><strong>Amount:</strong> ${totalAmount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> ${paymentEvidence}</p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Wedding Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Wedding Booking - ${name}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking your wedding with us! Here are the details:</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Type:</strong> ${marriageType}</li>
          <li><strong>Services:</strong> ${selectedServices.join(", ")}</li>
          <li><strong>Amount:</strong> ${totalAmount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          ${
            paymentEvidence
              ? "<li><strong>Payment Evidence:</strong> Uploaded</li>"
              : ""
          }
        </ul>
        <p>Your booking is pending admin verification.</p>
        <hr/>
        <p><em>Automated email, please do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res
      .status(201)
      .json({ message: "Booking created & emails sent!", booking });
  } catch (err) {
    console.error("Wedding booking error:", err);
    res.status(500).json({ error: "Server error while creating booking" });
  }
};
