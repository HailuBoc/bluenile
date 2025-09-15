import SaleBooking from "../models/SaleBooking.js";
import fs from "fs";
import path from "path";
import { transporter } from "../config/email.js"; // email config

// Create new sale booking
export const createSaleBooking = async (req, res) => {
  try {
    const { name, email, phone, car, amount, paymentMethod, specialRequests } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone || !car || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle payment evidence file
    let paymentEvidencePath = "";
    if (req.file) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const uploadPath = path.join(
        uploadDir,
        Date.now() + "-" + req.file.originalname
      );
      await fs.promises.rename(req.file.path, uploadPath);
      paymentEvidencePath = uploadPath;
    }

    // Create booking
    const booking = await SaleBooking.create({
      name,
      email,
      phone,
      car,
      amount: Number(amount),
      paymentMethod,
      specialRequests: specialRequests || "",
      paymentEvidence: paymentEvidencePath,
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
        <p><strong>Item:</strong> ${car}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        ${
          paymentEvidencePath
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidencePath}">View</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Sales Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Booking - ${car}`,
      html: `
        <h2>Booking ${booking.status === "paid" ? "Confirmed" : "Pending"}</h2>
        <p>Dear ${name},</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Item:</strong> ${car}</li>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Status:</strong> ${booking.status}</li>
          ${
            paymentEvidencePath
              ? "<li><strong>Payment Evidence:</strong> uploaded</li>"
              : ""
          }
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
