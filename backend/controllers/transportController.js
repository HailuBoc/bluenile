import Transport from "../models/Transport.js";
import { transporter } from "../config/email.js";

// Create transport booking with email notifications
export const createTransportBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      date,
      guests,
      specialRequests,
      selectedServices,
      paymentMethod,
      car,
      amount,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !guests ||
      !paymentMethod ||
      !car ||
      !amount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = await Transport.create({
      name,
      email,
      phone,
      date,
      guests,
      specialRequests,
      selectedServices,
      paymentMethod,
      car,
      amount,
      paymentStatus: paymentMethod === "Chapa" ? "completed" : "pending",
    });

    // Admin email
    const adminMailOptions = {
      from: `"Transport Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Transport Booking - ${car}`,
      html: `
        <h2>New Transport Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Car:</strong> ${car}</p>
        <p><strong>Selected Services:</strong> ${(selectedServices || []).join(
          ", "
        )}</p>
        <p><strong>Total Amount:</strong> ${amount} Birr</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${newBooking.paymentStatus}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || "N/A"}</p>
      `,
    };

    // User email
    const userMailOptions = {
      from: `"Transport Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Transport Booking - ${car}`,
      html: `
        <h2>Booking ${
          newBooking.paymentStatus === "completed" ? "Confirmed" : "Pending"
        }</h2>
        <p>Dear ${name},</p>
        <p>Your transport booking details:</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Car:</strong> ${car}</li>
          <li><strong>Selected Services:</strong> ${(
            selectedServices || []
          ).join(", ")}</li>
          <li><strong>Total Amount:</strong> ${amount} Birr</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Payment Status:</strong> ${newBooking.paymentStatus}</li>
          <li><strong>Special Requests:</strong> ${
            specialRequests || "N/A"
          }</li>
        </ul>
        <p>${
          newBooking.paymentStatus === "pending"
            ? "Please complete your payment as instructed."
            : "Your booking is confirmed!"
        }</p>
        <hr/>
        <p><em>Automated email, do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    // Payment redirect URL for Chapa
    let redirectUrl = "";
    if (paymentMethod === "Chapa") {
      redirectUrl = `https://chapa.co/pay/${newBooking._id}`;
    }

    res
      .status(201)
      .json({
        message: "Booking created successfully",
        booking: newBooking,
        redirectUrl,
      });
  } catch (err) {
    console.error("❌ Transport Booking Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all transport bookings
export const getTransports = async (req, res) => {
  try {
    const bookings = await Transport.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
