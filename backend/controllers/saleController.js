import SaleBooking from "../models/Sale.js";
import path from "path";
import { transporter } from "../config/email.js"; // Make sure transporter is set up

export const createSale = async (req, res) => {
  try {
    const { name, phone, email, car, amount, paymentMethod, specialRequests } =
      req.body;

    // ✅ Validate required fields
    if (!name || !phone || !email || !car || !amount || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Handle file upload (payment evidence)
    let paymentEvidence = null;
    if (req.files && req.files.paymentEvidence) {
      const file = req.files.paymentEvidence;
      const uploadPath = path.join("uploads", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      paymentEvidence = uploadPath;
    }

    // ✅ Save booking in MongoDB
    const sale = await SaleBooking.create({
      name,
      phone,
      email,
      car,
      amount,
      paymentMethod,
      specialRequests,
      paymentEvidence,
      paymentStatus: paymentMethod === "Chapa" ? "completed" : "pending",
    });

    // ✅ Prepare email notifications
    const adminMailOptions = {
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
        <p><strong>Payment Status:</strong> ${sale.paymentStatus}</p>
        ${
          paymentEvidence
            ? `<p><strong>Payment Evidence:</strong> <a href="${paymentEvidence}">View File</a></p>`
            : ""
        }
        <p><strong>Special Requests:</strong> ${specialRequests || "None"}</p>
      `,
    };

    const userMailOptions = {
      from: `"Car Sale Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Car Sale Booking - ${car}`,
      html: `
        <h2>Booking ${
          sale.paymentStatus === "completed" ? "Confirmed" : "Pending"
        }</h2>
        <p>Dear ${name},</p>
        <p>Your car sale booking details:</p>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Car:</strong> ${car}</li>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Payment Status:</strong> ${sale.paymentStatus}</li>
          ${
            paymentEvidence
              ? "<li><strong>Payment Evidence:</strong> Uploaded</li>"
              : ""
          }
          <li><strong>Special Requests:</strong> ${
            specialRequests || "None"
          }</li>
        </ul>
        <p>${
          sale.paymentStatus === "pending"
            ? "Your payment is pending. Admin will verify your evidence."
            : "Your payment is completed and booking is confirmed!"
        }</p>
        <hr/>
        <p><em>Automated email, do not reply.</em></p>
      `,
    };

    // ✅ Send emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return res.status(201).json({ status: "success", booking: sale });
  } catch (err) {
    console.error("Sale booking error:", err);
    return res
      .status(500)
      .json({ error: "Server error while creating booking" });
  }
};
