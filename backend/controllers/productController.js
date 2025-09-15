import { Reservation, Product } from "../models/ProductReservation.js";
import path from "path";
import { transporter } from "../config/email.js";
import fetch from "node-fetch";

/* ============================
   Get Product By ID
============================ */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
};

/* ============================
   Create Reservation
============================ */
export const createReservation = async (req, res) => {
  try {
    const {
      product,
      name,
      phone,
      email,
      checkIn,
      checkOut,
      nights,
      amount,
      paymentMethod,
    } = req.body;

    if (
      !product ||
      !name ||
      !phone ||
      !email ||
      !checkIn ||
      !checkOut ||
      !nights ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // Create reservation
    const reservation = await Reservation.create({
      product,
      name,
      phone,
      email,
      checkIn,
      checkOut,
      nights,
      amount,
      paymentMethod,
      paymentEvidence,
    });

    const bookedProduct = await Product.findById(product);

    // Send admin + user emails
    const adminMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Reservation - ${bookedProduct?.propertyName || "Product"}`,
      html: `
        <h2>New Reservation</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Product:</strong> ${
          bookedProduct?.propertyName
        } (ID: ${product})</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidence}">View</a></p>`
            : ""
        }
      `,
    };

    const userMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Reservation - ${bookedProduct?.propertyName || "Product"}`,
      html: `
        <h2>Reservation Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reserving <strong>${
          bookedProduct?.propertyName
        }</strong>.</p>
        <ul>
          <li><strong>Check-In:</strong> ${checkIn}</li>
          <li><strong>Check-Out:</strong> ${checkOut}</li>
          <li><strong>Nights:</strong> ${nights}</li>
          <li><strong>Amount:</strong> ${amount}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          ${
            paymentEvidence
              ? "<li><strong>Payment Evidence:</strong> Uploaded</li>"
              : ""
          }
        </ul>
        <p>We will confirm your reservation shortly.</p>
        <hr/>
        <p><em>Automated email, please do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    // Handle Chapa payment
    if (paymentMethod === "chapa") {
      const chapaRes = await fetch(
        "https://api.chapa.co/v1/transaction/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
            currency: "ETB",
            tx_ref: reservation._id.toString(),
            email: email,
            first_name: name.split(" ")[0] || name,
            last_name: name.split(" ")[1] || " ",
            callback_url: `${process.env.FRONTEND_URL}/reservation/success`,
            return_url: `${process.env.FRONTEND_URL}/reservation/success`,
          }),
        }
      );

      const chapaData = await chapaRes.json();
      if (!chapaData || !chapaData.data || !chapaData.data.checkout_url) {
        return res.status(500).json({ error: "Failed to start Chapa payment" });
      }

      return res.status(201).json({
        status: "success",
        reservation,
        checkout_url: chapaData.data.checkout_url,
      });
    }

    return res.status(201).json({ status: "success", reservation });
  } catch (err) {
    console.error("Reservation create error:", err);
    return res
      .status(500)
      .json({ error: "Server error while creating reservation" });
  }
};
