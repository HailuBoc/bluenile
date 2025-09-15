import Graduation from "../models/GraduationBooking.js";
import fs from "fs";
import path from "path";
import { transporter } from "../config/email.js";

// Create a new graduation booking
export const createGraduation = async (req, res) => {
  try {
    let {
      name,
      phone,
      email,
      date,
      guests,
      selectedServices,
      specialRequests,
      paymentMethod,
      totalAmount,
    } = req.body;

    // Parse selectedServices if it comes as a string
    if (typeof selectedServices === "string") {
      try {
        selectedServices = JSON.parse(selectedServices);
      } catch {
        selectedServices = [];
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
      !totalAmount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle optional paymentEvidence file
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
    const graduation = await Graduation.create({
      name,
      phone,
      email,
      date: new Date(date),
      guests: Number(guests),
      selectedServices,
      specialRequests: specialRequests || "",
      paymentMethod,
      totalAmount: Number(totalAmount),
      paymentEvidence: paymentEvidencePath,
      status: paymentMethod === "Chapa" ? "paid" : "pending",
    });

    // Send emails
    const adminMailOptions = {
      from: `"Graduation Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Graduation Booking - ${name}`,
      html: `
        <h2>New Graduation Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Selected Services:</strong> ${selectedServices.join(
          ", "
        )}</p>
        <p><strong>Total Amount:</strong> ${totalAmount} ETB</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> ${graduation.status}</p>
        ${
          paymentEvidencePath
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidencePath}">View File</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Graduation Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Graduation Booking - ${name}`,
      html: `
        <h2>Booking ${
          graduation.status === "paid" ? "Confirmed" : "Pending"
        }</h2>
        <p>Dear ${name},</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Selected Services:</strong> ${selectedServices.join(
            ", "
          )}</li>
          <li><strong>Total Amount:</strong> ${totalAmount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Status:</strong> ${graduation.status}</li>
          ${
            paymentEvidencePath
              ? "<li><strong>Payment Evidence:</strong> uploaded</li>"
              : ""
          }
        </ul>
        <p>${
          graduation.status === "pending"
            ? "Your payment is pending. Admin will verify your evidence."
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

    return res.status(201).json({ status: "success", booking: graduation });
  } catch (err) {
    console.error("Graduation booking error:", err);
    return res
      .status(500)
      .json({ error: "Server error while creating booking" });
  }
};
