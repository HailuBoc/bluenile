import HouseInterest from "../models/HouseInterest.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const submitHouseInterest = async (req, res) => {
  try {
    const {
      listingId,
      listingTitle,
      name,
      email,
      phone,
      offerPrice,
      paymentMethod,
      verificationFile,
    } = req.body;

    // Validate required fields
    if (
      !listingId ||
      !listingTitle ||
      !name ||
      !email ||
      !phone ||
      !offerPrice ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save to DB
    const interest = new HouseInterest({
      listingId,
      listingTitle,
      name,
      email,
      phone,
      offerPrice,
      paymentMethod,
      verificationFile,
    });
    await interest.save();

    // Admin email
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("Admin email not defined in environment variables");
    }

    const adminMailOptions = {
      from: `"House Reservation" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New House Reservation - ${listingTitle}`,
      html: `
        <h2>New House Interest Submitted</h2>
        <p><strong>Listing:</strong> ${listingTitle} (ID: ${listingId})</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Offer Price:</strong> ${offerPrice}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        ${
          verificationFile
            ? `<p><strong>Verification File:</strong> ${verificationFile}</p>`
            : ""
        }
      `,
    };

    // User confirmation email (detailed)
    const userMailOptions = {
      from: `"House Reservation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your House Reservation Request - ${listingTitle}`,
      html: `
        <h2>Reservation Received Successfully!</h2>
        <p>Dear ${name},</p>
        <p>We have received your interest for the following house:</p>
        <ul>
          <li><strong>Listing:</strong> ${listingTitle} (ID: ${listingId})</li>
          <li><strong>Offer Price:</strong> ${offerPrice}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          ${
            verificationFile
              ? `<li><strong>Verification File Submitted:</strong> Yes</li>`
              : ""
          }
        </ul>
        <p>Our admin team will contact you shortly to proceed.</p>
        <hr/>
        <p><em>This is an automated confirmation email. Please do not reply to this email.</em></p>
      `,
    };

    // Send both emails concurrently
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res
      .status(201)
      .json({
        message: "House interest submitted & emails sent to admin and user!",
      });
  } catch (error) {
    console.error("Submit house interest error:", error);
    res
      .status(500)
      .json({ message: "Error submitting interest", error: error.message });
  }
};
