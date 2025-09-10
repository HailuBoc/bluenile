import { HouseInterest } from "../models/HouseInterest.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const submitHouseInterest = async (req, res) => {
  try {
    const {
      houseId,
      houseTitle,
      name,
      email,
      phone,
      offerPrice,
      paymentMethod,
      verificationFile,
    } = req.body;

    if (
      !houseId ||
      !houseTitle ||
      !name ||
      !email ||
      !phone ||
      !offerPrice ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const interest = new HouseInterest({
      houseId,
      houseTitle,
      name,
      email,
      phone,
      offerPrice,
      paymentMethod,
      verificationFile,
    });
    await interest.save();

    // Admin and user emails (optional)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"House Reservation" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `New House Reservation - ${houseTitle}`,
        html: `<h2>New House Interest Submitted</h2>
               <p><strong>Listing:</strong> ${houseTitle} (ID: ${houseId})</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>`,
      });
    }

    res
      .status(201)
      .json({ message: "House interest submitted successfully!", interest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
