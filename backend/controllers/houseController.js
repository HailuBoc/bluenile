import HouseSaleReservation from "../models/HouseSaleReservation.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const createHouseReservation = async (req, res) => {
  try {
    const {
      houseId,
      houseName,
      name,
      email,
      phone,
      appointmentDate,
      paymentMethod,
    } = req.body;

    if (
      !houseId ||
      !houseName ||
      !name ||
      !email ||
      !phone ||
      !appointmentDate ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reservation = new HouseSaleReservation({
      houseId,
      houseName,
      name,
      email,
      phone,
      appointmentDate,
      paymentMethod,
    });

    await reservation.save();

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"House Reservation" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `New House Reservation - ${houseName}`,
        html: `<h2>New House Reservation Submitted</h2>
               <p><strong>Listing:</strong> ${houseName} (ID: ${houseId})</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
               <p><strong>Payment Method:</strong> ${paymentMethod}</p>`,
      });
    }

    // Confirmation email to client
    await transporter.sendMail({
      from: `"${houseName} Sales" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Appointment for ${houseName} is Confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Appointment Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for booking an appointment to view <strong>${houseName}</strong>.</p>
          
          <h3>Your Appointment Details</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Property:</strong> ${houseName}</li>
            <li><strong>Date:</strong> ${new Date(
              appointmentDate
            ).toDateString()}</li>
            <li><strong>Payment Method:</strong> ${paymentMethod}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>

          <p>Our sales representative will contact you shortly to confirm final details.</p>
          <p>If you have any questions, feel free to reply to this email.</p>

          <p style="margin-top: 30px;">Best regards,</p>
          <p><strong>${houseName} Sales Team</strong></p>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #666;">
            This is an automated message, please do not reply directly.
          </p>
        </div>
      `,
    });

    res.status(201).json({
      message: "House reservation submitted successfully!",
      reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getHouseReservations = async (req, res) => {
  try {
    const reservations = await HouseSaleReservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
