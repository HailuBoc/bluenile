import GeneralEvent from "../models/GeneralEventBooking.js";
import fs from "fs";
import path from "path";
import { transporter } from "../config/email.js";

// Create a new general event booking
export const createGeneralEvent = async (req, res) => {
  try {
    let {
      name,
      phone,
      email,
      date,
      guests,
      services,
      specialRequests,
      paymentMethod,
      amount,
    } = req.body;

    // Parse services if it's a string (from FormData)
    if (typeof services === "string") {
      try {
        services = JSON.parse(services);
      } catch {
        services = [];
      }
    }

    // Validate required fields
    if (
      !name ||
      !phone ||
      !email ||
      !date ||
      !guests ||
      !paymentMethod ||
      !amount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle file upload
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

    // Save booking
    const booking = await GeneralEvent.create({
      name,
      phone,
      email,
      date: new Date(date),
      guests: Number(guests),
      services,
      specialRequests: specialRequests || "",
      paymentMethod,
      amount: Number(amount),
      paymentEvidence: paymentEvidencePath,
      status: paymentMethod === "Chapa" ? "paid" : "pending",
    });

    // Send emails
    const adminMailOptions = {
      from: `"General Event Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New General Event Booking - ${name}`,
      html: `
        <h2>New General Event Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Services:</strong> ${services.join(", ")}</p>
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
      from: `"General Event Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Booking - ${name}`,
      html: `
        <h2>Booking ${booking.status === "paid" ? "Confirmed" : "Pending"}</h2>
        <p>Dear ${name},</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Services:</strong> ${services.join(", ")}</li>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Status:</strong> ${booking.status}</li>
          ${
            paymentEvidencePath
              ? "<li><strong>Payment Evidence:</strong> uploaded</li>"
              : ""
          }
        </ul>
        <p>${
          booking.status === "pending"
            ? "Please upload payment evidence if not using Chapa."
            : "Your payment is completed and booking is confirmed!"
        }</p>
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
    console.error("General event booking error:", err);
    return res
      .status(500)
      .json({ message: "Server error while creating booking" });
  }
};
