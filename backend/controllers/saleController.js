import SaleBooking from "../models/Sale.js";
import { transporter } from "../config/email.js";

export const createSale = async (req, res) => {
  try {
    const { name, phone, email, car, amount, paymentMethod } = req.body;

    if (!name || !phone || !email || !car || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sale = await SaleBooking.create({
      name,
      phone,
      email,
      car,
      amount,
      paymentMethod,
      paymentStatus:
        paymentMethod === "bank_transfer" ? "pending" : "confirmed",
    });

    // --- Send emails (admin + client) ---
    const adminMail = {
      from: `"Car Sale Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Car Sale Booking - ${name}`,
      html: `
        <h2>New Car Sale Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Car:</strong> ${car}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> ${sale.paymentStatus}</p>
      `,
    };

    const userMail = {
      from: `"Car Sale Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Car Sale Booking - ${car}`,
      html: `
        <h2>Booking ${sale.paymentStatus}</h2>
        <p>Dear ${name},</p>
        <p>We received your booking for <strong>${car}</strong>.</p>
        <ul>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Status:</strong> ${sale.paymentStatus}</li>
        </ul>
        <p>We will contact you shortly with further details.</p>
        <hr/>
        <p><em>This is an automated email, please do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail),
    ]);

    return res
      .status(201)
      .json({ message: "Booking created successfully", booking: sale });
  } catch (err) {
    console.error("❌ Sale booking error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
