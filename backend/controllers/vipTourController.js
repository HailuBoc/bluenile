import VipTour from "../models/VipTour.js";
import { transporter } from "../config/email.js";

export const createVipTourBooking = async (req, res) => {
  try {
    const {
      destination,
      date,
      extras,
      notes,
      phone,
      email,
      numberOfPeople,
      paymentMethod,
      paymentProof, // optional: URL or base64
    } = req.body;

    // Validate required fields
    if (!destination || !date || !phone || !email || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Normalize payment method
    const normalizedPayment = paymentMethod.trim().toLowerCase();

    // Auto-complete payment for Chapa and Mpesa
    const autoCompletedMethods = ["chapa", "mpesa"];

    const bookingData = {
      destination: destination.trim(),
      date: new Date(date),
      extras: Array.isArray(extras) ? extras : extras ? JSON.parse(extras) : [],
      notes: notes?.trim() || "",
      phone: phone.trim(),
      email: email.trim(),
      numberOfPeople: Number(numberOfPeople) || 1,
      paymentMethod: paymentMethod.trim(),
      paymentProof: paymentProof || "",
      paymentStatus: autoCompletedMethods.includes(normalizedPayment)
        ? "completed"
        : "pending",
    };

    const booking = await VipTour.create(bookingData);

    // Admin email
    const adminMailOptions = {
      from: `"VIP Tour Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New VIP Tour Booking - ${destination}`,
      html: `
        <h2>New VIP Tour Booking</h2>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>People:</strong> ${bookingData.numberOfPeople}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>VIP Extras:</strong> ${
          bookingData.extras.length ? bookingData.extras.join(", ") : "None"
        }</p>
        <p><strong>Additional Notes:</strong> ${notes || "None"}</p>
        ${
          bookingData.paymentProof
            ? `<p><strong>Payment Proof:</strong> <a href="${bookingData.paymentProof}">View</a></p>`
            : ""
        }
        <p><strong>Payment Status:</strong> ${bookingData.paymentStatus}</p>
      `,
    };

    // User email
    const userMailOptions = {
      from: `"VIP Tour Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your VIP Tour Booking - ${destination}`,
      html: `
        <h2>Booking ${
          bookingData.paymentStatus === "completed" ? "Confirmed" : "Pending"
        }</h2>
        <p>Dear Customer,</p>
        <p>Your VIP tour booking details:</p>
        <ul>
          <li><strong>Destination:</strong> ${destination}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Number of People:</strong> ${
            bookingData.numberOfPeople
          }</li>
          <li><strong>VIP Extras:</strong> ${
            bookingData.extras.length ? bookingData.extras.join(", ") : "None"
          }</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          ${
            bookingData.paymentProof
              ? "<li><strong>Payment Proof:</strong> Provided</li>"
              : ""
          }
          <li><strong>Additional Notes:</strong> ${notes || "None"}</li>
          <li><strong>Payment Status:</strong> ${bookingData.paymentStatus}</li>
        </ul>
        <p>${
          bookingData.paymentStatus === "pending"
            ? "Your payment is pending. Admin will verify your proof."
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

    return res.status(201).json({
      status: "success",
      message: "VIP tour booking submitted successfully!",
      booking,
    });
  } catch (err) {
    console.error("VIP Tour booking error:", err);
    return res
      .status(500)
      .json({ error: "Server error while creating VIP tour booking" });
  }
};
