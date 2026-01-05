import SaleBooking from "../models/SaleBooking.js";
import { transporter } from "../config/email.js"; // email config

// Create new sale booking (no multer / file upload)
export const createSaleBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      itemTitle,
      amount,
      paymentMethod,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !itemTitle || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create booking
    const booking = await SaleBooking.create({
      name,
      email,
      phone,
      car: itemTitle, // keep compatibility with model (field name: car)
      amount: Number(amount),
      paymentMethod,
      specialRequests: specialRequests || "",
      status: paymentMethod === "Chapa" ? "paid" : "pending",
    });

    // Optional: send email notifications
    const adminMailOptions = {
      from: `"Sales Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Sale Booking - ${name}`,
      html: `
        <h2>New Sale Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Item:</strong> ${itemTitle}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      `,
    };

    const userMailOptions = {
      from: `"Sales Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Booking - ${itemTitle}`,
      html: `
        <h2>Booking ${booking.status === "paid" ? "Confirmed" : "Pending"}</h2>
        <p>Dear ${name},</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Item:</strong> ${itemTitle}</li>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Status:</strong> ${booking.status}</li>
        </ul>
        <hr/>
        <p><em>Automated email, do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return res.status(201).json({ status: "success", booking });
  } catch (err) {
    console.error("Sale booking error:", err);
    return res
      .status(500)
      .json({ message: "Server error while creating booking" });
  }
};
