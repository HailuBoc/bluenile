import CarReservation from "../models/CarSale.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const submitCarReservation = async (req, res) => {
  try {
    const { carId, carTitle, carPrice, name, email, phone, paymentMethod } =
      req.body;

    // Validate required fields
    if (
      !carId ||
      !carTitle ||
      !carPrice ||
      !name ||
      !email ||
      !phone ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save to DB
    const reservation = new CarReservation({
      carId,
      carTitle,
      carPrice,
      name,
      email,
      phone,
      paymentMethod,
    });
    await reservation.save();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail)
      throw new Error("Admin email not defined in environment variables");

    // Admin email
    const adminMailOptions = {
      from: `"Car Reservation" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Car Reservation - ${carTitle}`,
      html: `
        <h2>New Car Reservation Submitted</h2>
        <p><strong>Car:</strong> ${carTitle} (ID: ${carId})</p>
        <p><strong>Price:</strong> ${carPrice} birr</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      `,
    };

    // User email
    const userMailOptions = {
      from: `"Car Reservation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Car Reservation - ${carTitle}`,
      html: `
        <h2>Reservation Confirmed!</h2>
        <p>Dear ${name},</p>
        <p>Your reservation for:</p>
        <ul>
          <li><strong>Car:</strong> ${carTitle} (ID: ${carId})</li>
          <li><strong>Price:</strong> ${carPrice} birr</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
        </ul>
        <p>Our team will contact you shortly to finalize details.</p>
        <hr/>
        <p><em>This is an automated confirmation email. Do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res
      .status(201)
      .json({ message: "Car reservation submitted & emails sent!" });
  } catch (error) {
    console.error("Submit car reservation error:", error);
    res
      .status(500)
      .json({ message: "Error submitting reservation", error: error.message });
  }
};
