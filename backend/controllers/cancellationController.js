import Cancellation from "../models/Cancellation.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

// Create a new cancellation request
export const createCancellation = async (req, res) => {
  try {
    const { bookingType, phoneNumber, userEmail, reason } = req.body;

    if (!bookingType || !phoneNumber || !userEmail || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCancellation = await Cancellation.create({
      bookingType,
      phoneNumber,
      userEmail,
      reason,
    });

    // ✅ Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Booking Cancellation" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `New Cancellation - ${bookingType}`,
        html: `
          <h2>New Booking Cancellation</h2>
          <p><strong>Booking Type:</strong> ${bookingType}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        `,
      });
    }

    // ✅ Confirmation Email to User
    await transporter.sendMail({
      from: `"${bookingType} Service" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Your ${bookingType} booking cancellation request`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #dc2626;">Cancellation Submitted</h2>
          <p>Dear Customer,</p>
          <p>We have received your cancellation request for your <strong>${bookingType}</strong> booking.</p>
          
          <h3>Details:</h3>
          <ul style="list-style:none;padding:0;">
            <li><strong>Booking Type:</strong> ${bookingType}</li>
            <li><strong>Phone:</strong> ${phoneNumber}</li>
            <li><strong>Email:</strong> ${userEmail}</li>
            <li><strong>Reason:</strong> ${reason}</li>
          </ul>

          <p>Our team will review your request shortly. You will receive another email once it is approved or rejected.</p>

          <p style="margin-top:20px;">Best regards,</p>
          <p><strong>${bookingType} Service Team</strong></p>
        </div>
      `,
    });

    res.status(201).json({
      message: "Cancellation request submitted successfully!",
      cancellation: newCancellation,
    });
  } catch (err) {
    console.error("❌ Failed to create cancellation:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all cancellation requests (for admin panel)
export const getCancellations = async (req, res) => {
  try {
    const cancellations = await Cancellation.find().sort({ createdAt: -1 });
    res.json(cancellations);
  } catch (err) {
    console.error("❌ Failed to fetch cancellations:", err);
    res.status(500).json({ message: err.message });
  }
};

// Approve a cancellation
export const approveCancellation = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation)
      return res.status(404).json({ message: "Cancellation not found" });

    cancellation.status = "approved";
    await cancellation.save();

    // ✅ Email User about Approval
    await transporter.sendMail({
      from: `"${cancellation.bookingType} Service" <${process.env.EMAIL_USER}>`,
      to: cancellation.userEmail,
      subject: `Your ${cancellation.bookingType} cancellation was approved`,
      html: `<p>Dear Customer,</p>
             <p>Your cancellation request for <strong>${cancellation.bookingType}</strong> has been <strong style="color:green;">approved</strong>.</p>
             <p>We’re sorry to see you go, and hope to serve you again in the future.</p>`,
    });

    res.json({ message: "Cancellation approved", cancellation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject a cancellation
export const rejectCancellation = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation)
      return res.status(404).json({ message: "Cancellation not found" });

    cancellation.status = "rejected";
    await cancellation.save();

    // ✅ Email User about Rejection
    await transporter.sendMail({
      from: `"${cancellation.bookingType} Service" <${process.env.EMAIL_USER}>`,
      to: cancellation.userEmail,
      subject: `Your ${cancellation.bookingType} cancellation was rejected`,
      html: `<p>Dear Customer,</p>
             <p>Your cancellation request for <strong>${cancellation.bookingType}</strong> has been <strong style="color:red;">rejected</strong>.</p>
             <p>If you think this is a mistake, please contact our support team.</p>`,
    });

    res.json({ message: "Cancellation rejected", cancellation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a cancellation request
export const deleteCancellation = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation)
      return res.status(404).json({ message: "Cancellation not found" });

    await Cancellation.deleteOne({ _id: req.params.id });
    res.json({ message: "Cancellation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
