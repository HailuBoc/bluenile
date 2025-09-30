// controllers/SpecialReservationController.js
import SpecialReservations from "../models/specialOfferReservation.js";
import fs from "fs";
import path from "path";
import { transporter } from "../config/email.js"; // optional: if you have email config
import dotenv from "dotenv";
dotenv.config();

export const createSpecialReservation = async (req, res) => {
  try {
    console.log("createSpecialReservation called", {
      body: req.body,
      file: !!req.file,
    });

    const {
      offerId,
      offerTitle,
      startDate,
      endDate,
      days,
      amount,
      name,
      email,
      phone,
      paymentMethod,
    } = req.body;

    if (
      !offerId ||
      !offerTitle ||
      !startDate ||
      !endDate ||
      !amount ||
      !name ||
      !email ||
      !phone ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // handle file if present (multer saved a tmp file to ./uploads by default)
    let paymentEvidencePath = "";
    if (req.file) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      // keep filename same as multer but move if multer stored to tmp path
      const destPath = path.join(
        uploadDir,
        Date.now() + "-" + req.file.originalname
      );
      await fs.promises.rename(req.file.path, destPath).catch(() => {}); // if file already in dest, ignore
      paymentEvidencePath = destPath;
    }

    const reservation = await SpecialReservations.create({
      offerId,
      offerTitle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days: Number(days || 1),
      amount: Number(amount),
      name,
      email,
      phone,
      paymentMethod,
      paymentEvidence: paymentEvidencePath,
      status: paymentMethod === "chapa" ? "paid" : "pending",
    });

    // optional: send email notifications (if transporter exists)
    if (transporter && process.env.ADMIN_EMAIL) {
      const adminMail = {
        from: `"Special Reservation" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Special Reservation - ${offerTitle}`,
        html: `<p>New reservation by ${name} (${email}, ${phone}) for ${offerTitle} — amount: ${amount}</p>`,
      };

      const userMail = {
        from: `"Special Reservation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Reservation Received - ${offerTitle}`,
        html: `<p>Thanks ${name}, we received your reservation for ${offerTitle}.</p>`,
      };

      transporter
        .sendMail(adminMail)
        .catch((e) => console.error("admin mail error:", e));
      transporter
        .sendMail(userMail)
        .catch((e) => console.error("user mail error:", e));
    }

    return res.status(201).json({ status: "success", reservation });
  } catch (err) {
    console.error("Special reservation error:", err);
    return res.status(500).json({
      message: "Server error while creating reservation",
      error: err.message,
    });
  }
};

// Optional helper routes for debugging
export const listSpecialReservations = async (req, res) => {
  try {
    const list = await SpecialReservations.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
