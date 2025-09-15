import TourismReservation from "../models/TourismReservation.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const submitTourismReservation = async (req, res) => {
  try {
    const {
      tourismId,
      tourismTitle,
      startDate,
      endDate,
      days,
      amount,
      name,
      email,
      phone,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !tourismId ||
      !tourismTitle ||
      !startDate ||
      !endDate ||
      !days ||
      !amount ||
      !name ||
      !email ||
      !phone ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save reservation
    const reservation = new TourismReservation({
      tourismId,
      tourismTitle,
      startDate,
      endDate,
      days,
      amount,
      name,
      email,
      phone,
      paymentMethod,
      paymentEvidence: req.file?.path, // if using multer
    });

    await reservation.save();

    // Send emails
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail)
      throw new Error("Admin email not defined in environment variables");

    const adminMailOptions = {
      from: `"Tourism Reservation" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Tourism Reservation - ${tourismTitle}`,
      html: `
        <h2>New Tourism Reservation Submitted</h2>
        <p><strong>Tourism:</strong> ${tourismTitle} (ID: ${tourismId})</p>
        <p><strong>Dates:</strong> ${new Date(
          startDate
        ).toDateString()} - ${new Date(endDate).toDateString()}</p>
        <p><strong>Days:</strong> ${days}</p>
        <p><strong>Amount:</strong> ${amount} birr</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      `,
    };

    const userMailOptions = {
      from: `"Tourism Reservation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Tourism Reservation - ${tourismTitle}`,
      html: `
        <h2>Reservation Confirmed!</h2>
        <p>Dear ${name},</p>
        <p>Your reservation for:</p>
        <ul>
          <li><strong>Tourism:</strong> ${tourismTitle}</li>
          <li><strong>Dates:</strong> ${new Date(
            startDate
          ).toDateString()} - ${new Date(endDate).toDateString()}</li>
          <li><strong>Days:</strong> ${days}</li>
          <li><strong>Amount:</strong> ${amount} birr</li>
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
      .json({
        message: "Tourism reservation submitted & emails sent!",
        reservation,
      });
  } catch (error) {
    console.error("Submit tourism reservation error:", error);
    res
      .status(500)
      .json({ message: "Error submitting reservation", error: error.message });
  }
};
