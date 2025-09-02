import QuoteRequest from "../models/QuoteRequest.js";
import { transporter } from "../config/email.js"; // Make sure transporter is setup

// Create a new quote request
export const createQuoteRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      guests,
      selectedServices,
      totalPrice,
      message,
    } = req.body;

    // ------------------------
    // Validation
    // ------------------------
    if (!name || !email || !phone || !eventType || !eventDate || !guests) {
      return res
        .status(400)
        .json({ error: "Missing required fields for quote request" });
    }

    // ------------------------
    // Parse services array
    // ------------------------
    let services = [];
    try {
      services = selectedServices ? JSON.parse(selectedServices) : [];
    } catch {
      services = [];
    }

    // ------------------------
    // Save to DB
    // ------------------------
    const quote = await QuoteRequest.create({
      name,
      email,
      phone,
      eventType,
      eventDate,
      guests,
      selectedServices: services,
      totalPrice,
      message,
    });

    // ------------------------
    // Email to Admin
    // ------------------------
    const adminMailOptions = {
      from: `"Quote Request" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Quote Request - ${eventType}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Event Date:</strong> ${new Date(
          eventDate
        ).toDateString()}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Selected Services:</strong> ${services.join(", ")}</p>
        <p><strong>Total Price:</strong> ${totalPrice || "N/A"} ETB</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
      `,
    };

    // ------------------------
    // Email to User
    // ------------------------
    const userMailOptions = {
      from: `"Quote Request" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Quote Request Confirmation - ${eventType}`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for submitting a quote request for your ${eventType}.</p>
        <p>Here are the details we received:</p>
        <ul>
          <li><strong>Event Date:</strong> ${new Date(
            eventDate
          ).toDateString()}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Selected Services:</strong> ${services.join(", ")}</li>
          <li><strong>Total Price:</strong> ${totalPrice || "N/A"} ETB</li>
          <li><strong>Message:</strong> ${message || "N/A"}</li>
        </ul>
        <p>Our team will contact you shortly to provide a detailed quote.</p>
        <hr/>
        <p><em>Automated email, do not reply.</em></p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res
      .status(201)
      .json({ message: "Quote request submitted successfully", quote });
  } catch (error) {
    console.error("Quote request error:", error);
    res
      .status(500)
      .json({ error: "Server error while creating quote request" });
  }
};

// Get all quote requests
export const getQuoteRequests = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    res.status(200).json(quotes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while fetching quote requests" });
  }
};

// Get a single quote request by ID
export const getQuoteRequestById = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote)
      return res.status(404).json({ error: "Quote request not found" });
    res.status(200).json(quote);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while fetching quote request" });
  }
};
